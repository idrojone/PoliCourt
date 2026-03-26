import { Injectable } from '@nestjs/common';
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
    const newRequest = new this.monitorRequestModel(data);
    return newRequest.save();
  }
}