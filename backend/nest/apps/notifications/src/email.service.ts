import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
    private resend: Resend;

    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
    }

    async sendEmail(to: string, subject: string, htmlContent: string) {
        try {
            const data = await this.resend.emails.send({
                from: 'PoliCourt <notificaciones@idrojone.tech>',
                to,
                subject,
                html: htmlContent,
            });
            return data;
        } catch (error) {
            console.error(`[notifications-ms] Error enviando email a ${to}`, error);
            throw error;
        }
    }
}