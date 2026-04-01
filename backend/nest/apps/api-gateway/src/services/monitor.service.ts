import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { CreateMonitorRequestDto } from "../dto/create-monitor-request.dto";
import { firstValueFrom } from "rxjs";

@Injectable()
export class MonitorService {
  constructor(
      @Inject('MONITOR_SERVICE') private readonly monitorClient: ClientProxy,
  ) {}

  async applyForMonitor(dto: CreateMonitorRequestDto, files: Express.Multer.File[], userEmail: string) {
      
      const documentPaths = files ? files.map(file => file.path) : [];
  
      if (documentPaths.length === 0) {
        throw new Error('Debe subir al menos un documento acreditativo.');
      }
  
      const payload = {
        ...dto,
        documents: documentPaths,
        email: userEmail,
      };
  
      if (!userEmail) {
        throw new Error('Email de usuario no identificado');
      }
  
      try {
        const response = await firstValueFrom(
          this.monitorClient.send('create_monitor_request', payload)
        );
        return { status: 'success', data: response };
      } catch (error: any) {
        const microserviceMessage =
          error?.response?.message || error?.message || error?.message?.message || 'Internal server error';
        throw new Error(microserviceMessage);
      }
  }

  async getMyApplications(userEmail: string) {
      if (!userEmail) {
        throw new Error('Email de usuario no identificado');
      }
      try {
        const response = await firstValueFrom(
          this.monitorClient.send('get_monitor_applications', { email: userEmail })
        );
        return { status: 'success', data: response };
      }
      catch (error: any) {
        const microserviceMessage =
          error?.response?.message || error?.message || error?.message?.message || 'Internal server error';
        throw new Error(microserviceMessage);
      }
  }

  async changeStatus(uuid: string, status: string) {
      try {
        const response = await firstValueFrom(
          this.monitorClient.send('change_monitor_status', { uuid, status })  
        );
        return { status: 'success', data: response };
      }
      catch (error: any) {  
        const microserviceMessage =
          error?.response?.message || error?.message || error?.message?.message || 'Internal server error';
        throw new Error(microserviceMessage);
      }
  }

  async getAllApplications() {
      try {
        const response = await firstValueFrom(
          this.monitorClient.send('get_all_monitor_applications', {})
        );
        return { status: 'success', data: response };
      }
      catch (error: any) {
        const microserviceMessage =
          error?.response?.message || error?.message || error?.message?.message || 'Internal server error';
        throw new Error(microserviceMessage);
      }
  }
}