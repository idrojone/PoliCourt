import { Controller, Post, Body, UploadedFiles, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { CreateMonitorRequestDto } from './dto/create-monitor-request.dto';
import { getMulterOptions } from './config/multer.config';

@Controller('monitors')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('apply')
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
