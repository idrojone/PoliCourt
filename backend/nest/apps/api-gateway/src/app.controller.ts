import { Controller, Post, Body, UploadedFiles, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { CreateMonitorRequestDto } from './dto/create-monitor-request.dto';
import { getMulterOptions } from './config/multer.config';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('monitors')
@Controller('monitors')
export class AppController {
  constructor(private readonly appService: AppService) { }

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
    @UploadedFiles() files: Array<Express.Multer.File>
  ) {
    try {
      return await this.appService.applyForMonitor(dto, files);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }
}
