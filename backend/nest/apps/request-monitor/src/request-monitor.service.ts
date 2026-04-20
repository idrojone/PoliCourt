import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MonitorRequest, MonitorRequestDocument } from './schemas/monitor-request.schema';
import {
  CreateMonitorPayload,
  GetAllMonitorApplicationsPayload,
} from './interfaces/monitor-payload.interface';
import jwt from 'jsonwebtoken';

@Injectable()
export class RequestMonitorService {
  private readonly logger = new Logger(RequestMonitorService.name);

  constructor(
    @InjectModel(MonitorRequest.name) private monitorRequestModel: Model<MonitorRequestDocument>,
  ) { }

  async createMonitorRequest(data: CreateMonitorPayload): Promise<MonitorRequest> {
    const existingPending = await this.monitorRequestModel.findOne({
      email: data.email,
      status: 'pending',
    }).exec();

    if (existingPending) {
      throw new RpcException('Ya existe una solicitud en estado pending para este email');
    }

    const newRequest = new this.monitorRequestModel(data);
    const saved = await newRequest.save();
    return saved.toJSON();
  }

  async getAllMonitorRequests(): Promise<MonitorRequest[]> {
    const requests = await this.monitorRequestModel.find().exec();
    return requests.map(req => req.toJSON());
  }

  async setMonitorRequestStatus(uuid: string, status: string): Promise<MonitorRequest> {
    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new RpcException('Invalid status');
    }

    const existing = await this.monitorRequestModel.findOne({ uuid }).exec();
    if (!existing) {
      throw new RpcException('Monitor request not found');
    }

    if (status === 'approved') {
      if (!existing.email) {
        throw new RpcException('Email de usuario no identificado');
      }

      // Primero intenta asignar el rol en el servicio externo.
      await this.postMonitorRoleToUserService(existing.email);
    }

    const updated = await this.monitorRequestModel.findOneAndUpdate(
      { uuid },
      { status },
      { new: true },
    ).exec();

    return updated?.toJSON() as MonitorRequest;
  }

  private async postMonitorRoleToUserService(email: string) {
    const secret =
      process.env.REQUEST_MONITOR_JWT_SECRET ||
      process.env.JWT_SECRET ||
      'default_super_secret';

    const nowSeconds = Math.floor(Date.now() / 1000);
    const token = jwt.sign(
      {
        sub: 'admin@admin.com',
        role: 'ADMIN',
        userId: 1,
        sessionVersion: 0,
        iat: nowSeconds,
        exp: nowSeconds + 60,
      },
      secret,
    );

    const userServiceBaseUrl =
      (process.env.USER_SERVICE_BASE_URL || 'http://localhost:4001').replace(/\/+$/, '');

    // Use encodeURI so '@' stays as '@' in the path segment (matches API expectation)
    const endpoint = `${userServiceBaseUrl}/api/users/${encodeURI(email)}/role-monitor`;

    this.logger.log(`Asignando rol MONITOR a ${email} vía ${endpoint}`);

    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role: 'MONITOR' }),
    });

    if (!response.ok) {
      const bodyText = await response.text();
      this.logger.error(`No se pudo asignar rol MONITOR: ${response.status} - ${bodyText}`);
      throw new RpcException(`Failed to assign MONITOR role: ${response.status}`);
    }

    this.logger.log(`Rol MONITOR asignado exitosamente a ${email}`);
  }

  private getPagination(page?: number, limit?: number) {
    const safePage = Number.isFinite(page) ? Math.max(1, Number(page)) : 1;
    const safeLimit = Number.isFinite(limit) ? Math.max(1, Number(limit)) : 10;
    const skip = (safePage - 1) * safeLimit;

    return { safePage, safeLimit, skip };
  }

  async getMonitorApplications(email: string, page?: number, limit?: number) {
    const { safePage, safeLimit, skip } = this.getPagination(page, limit);

    const filter: Record<string, any> = { email };

    const [items, total] = await Promise.all([
      this.monitorRequestModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean()
        .exec(),
      this.monitorRequestModel.countDocuments(filter).exec(),
    ]);

    return {
      items,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async getAllMonitorApplications(payload: GetAllMonitorApplicationsPayload) {
    const { page, limit, email, status } = payload || {};
    const { safePage, safeLimit, skip } = this.getPagination(page, limit);

    const filter: Record<string, any> = {};

    if (email?.trim()) {
      filter.email = { $regex: email.trim(), $options: 'i' };
    }

    if (status?.trim()) {
      filter.status = status.trim().toLowerCase();
    }

    const [items, total] = await Promise.all([
      this.monitorRequestModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit)
        .lean()
        .exec(),
      this.monitorRequestModel.countDocuments(filter).exec(),
    ]);

    return {
      items,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }
}