import { Controller, Post, Body, UploadedFiles, UseInterceptors, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { CreateMonitorRequestDto } from './dto/create-monitor-request.dto';
import { getMulterOptions } from './config/multer.config';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AuthGuardJwt } from './auth/auth-jwt.guard';

@ApiTags('api-gateway')
@Controller('api-gateway')
export class AppController {

}
