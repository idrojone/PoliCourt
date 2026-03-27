import { BadRequestException, Body, Controller, Get, Post, Req, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from "@nestjs/swagger";
import { MonitorService } from "../services/monitor.service";
import { AuthGuardJwt } from "../auth/auth-jwt.guard";
import { CreateMonitorRequestDto } from "../dto/create-monitor-request.dto";
import { getMulterOptions } from "../config/multer.config";
import { FilesInterceptor } from "@nestjs/platform-express";
import { AdminGuard } from "../auth/admin.guard";

@ApiTags('monitor')
@Controller('monitor')
export class MonitorController {
  constructor(private readonly monitorService: MonitorService) { }
    
  @UseGuards(AuthGuardJwt)
  @Post('apply')
  @ApiOperation({ summary: 'Solicitar un monitor con archivos adjuntos' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Datos de solicitud y diplomas a adjuntar',
    type: CreateMonitorRequestDto,
  })
  @UseInterceptors(FilesInterceptor('diplomas', 5, getMulterOptions('./uploads/diplomas')))
  async applyForMonitor(
    @Body() dto: CreateMonitorRequestDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() request: any,
  ) {
    try {
      return await this.monitorService.applyForMonitor(dto, files, request.user?.email);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuardJwt)
  @ApiOperation({ summary: 'Obtener mis solicitudes de monitor' })
  @Get('my-applications')
  async getMyApplications(@Req() request: any) {
    try {
      return await this.monitorService.getMyApplications(request.user?.email);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuardJwt, AdminGuard)
  @Post('change-status')
  @ApiOperation({ summary: 'Cambiar el estado de una solicitud de monitor' })
  async changeStatus(@Body() data: { uuid: string; status: string }) {
    try {
      return await this.monitorService.changeStatus(data.uuid, data.status);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
    
}
