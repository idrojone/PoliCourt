import { BadRequestException, Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { MonitorService } from "../services/monitor.service";
import { AuthGuardJwt } from "../auth/auth-jwt.guard";
import { CreateMonitorRequestDto } from "../dto/create-monitor-request.dto";
import { getMulterOptions } from "../config/multer.config";
import { FilesInterceptor } from "@nestjs/platform-express";
import { AdminGuard } from "../auth/admin.guard";
import { join } from 'path';

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
  @UseInterceptors(FilesInterceptor('diplomas', 5, getMulterOptions(join(process.cwd(), 'uploads', 'diplomas'))))
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
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @Get('my-applications')
  async getMyApplications(
    @Req() request: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    try {
      return await this.monitorService.getMyApplications(request.user?.email, page, limit);
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

  @UseGuards(AuthGuardJwt, AdminGuard)
  @ApiOperation({ summary: 'Obtener todas las solicitudes de monitor' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Página a solicitar. Valor por defecto: 1' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Número de resultados por página. Valor por defecto: 10' })
  @ApiQuery({ name: 'email', required: false, type: String, example: 'usuario@correo.com', description: 'Filtrar solicitudes por email de usuario' })
  @ApiQuery({ name: 'status', required: false, type: String, example: 'pending', description: 'Filtrar solicitudes por estado: pending, approved, rejected' })
  @Get('all-applications')
  async getAllApplications(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('email') email?: string,
    @Query('status') status?: string,
  ) {
    try {
      return await this.monitorService.getAllApplications(page, limit, email, status);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
    
}
