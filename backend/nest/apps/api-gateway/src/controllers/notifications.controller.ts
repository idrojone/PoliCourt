import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsGatewayController {
    constructor(
        @Inject('NOTIFICATIONS_SERVICE') private readonly notificationsClient: ClientProxy,
    ) { }

    @Post('email')
    @ApiOperation({ summary: 'Dispara una notificación IA de prueba a un socio' })
    triggerTestNotification(@Body() body: { email: string, task_description?: string, tone?: string, data?: any}) {
        const payload = {
            userEmail: body.email,
            task_description: body.task_description,
            tone: body.tone,
            data: body.data
        };

        this.notificationsClient.emit('send_ai_email_notification', payload);

        return {
            message: 'Evento enviado a la cola de RabbitMQ. El microservicio lo procesará en segundo plano.'
        };
    }
}