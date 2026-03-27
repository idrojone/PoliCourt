import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MonitorRequest, MonitorRequestDocument } from './schemas/monitor-request.schema';
import { CreateMonitorPayload } from './interfaces/monitor-payload.interface';

@Injectable()
export class RequestMonitorService {
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

    const updated = await this.monitorRequestModel.findOneAndUpdate(
      { uuid },
      { status },
      { new: true },
    ).exec();
    
    if (!updated) {
      throw new RpcException('Monitor request not found');
    }

    return updated.toJSON();
  }

  async getMonitorApplications(email: string): Promise<MonitorRequest[]> {
    const requests = await this.monitorRequestModel.find({ email }).exec();
    return requests.map(req => req.toJSON());
  }
}