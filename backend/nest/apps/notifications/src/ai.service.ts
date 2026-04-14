import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);
    private blacklist = new Set<string>();
  private readonly defaultEmailTimeZone = process.env.EMAIL_TIMEZONE || 'Europe/Madrid';
  private readonly isoDateRegex =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/;

    private providers = [
        { name: 'Gemini', execute: (prompt: string) => this.callGemini(prompt) },
        { name: 'Groq', execute: (prompt: string) => this.callGroq(prompt) }
    ];

    async generateEmailContent(
      taskDescription: string,
      data: any,
      tone: string = 'Profesional',
      explicitTimeZone?: string,
    ) {
      const timeZone = this.resolveTimeZone(
        explicitTimeZone || data?.timeZone || data?.timezone || data?.tz,
      );
      const normalizedData = this.normalizeDatesForPrompt(data ?? {}, timeZone);

        const prompt = `
      Eres el sistema automatizado del polideportivo "PoliCourt".
      Redacta un correo electrónico para un socio.
      Tono: ${tone}.
      
      Situación: ${taskDescription}
      Zona horaria de referencia para todo el correo: ${timeZone}
      Datos adicionales (ya normalizados en hora local): ${JSON.stringify(normalizedData)}

      Reglas obligatorias sobre horarios:
      - No conviertas zonas horarias ni restes/sumes horas.
      - No pases horarios a UTC o GMT.
      - Si recibes un rango de hora de inicio y fin, respétalo exactamente.

      Usa siempre el mismo estilo CSS inline para todo el cuerpo del correo: fuente Arial, color #111, fondo blanco, espaciado cómodo y texto legible.
      El mensaje debe tener un diseño corporativo y elegante: fondo general suave, tarjeta blanca centrada con sombra ligera, cabecera con logo/identidad de PoliCourt y bloques de contenido bien estructurados.
      No incluyas ninguna referencia a ID, identificador, número interno, ni campos de identificación en el asunto o el cuerpo.

      Devuelve ÚNICAMENTE un objeto JSON válido con este formato exacto:
      {
        "subject": "Asunto corto y claro",
        "body": "Cuerpo del correo en formato HTML, usa etiquetas <p>, <strong>, <br>. Sé directo."
      }
    `;

        for (const provider of this.providers) {
            if (this.blacklist.has(provider.name)) {
                this.logger.warn(`⏩ Saltando ${provider.name} (en lista negra temporal)`);
                continue;
            }

            try {
                this.logger.log(`🤖 Generando contenido usando [${provider.name}]...`);
                const jsonString = await provider.execute(prompt);
                const result = JSON.parse(jsonString) as { subject: string; body: string };
                return {
                    subject: this.removeIdReferences(result.subject),
                    body: this.applyEmailStyles(this.removeIdReferences(result.body))
                };
            } catch (error: any) {
                this.logger.error(`❌ Fallo en ${provider.name}: ${error.message}. Añadiendo a lista negra.`);
                this.blacklist.add(provider.name);

                setTimeout(() => {
                    this.blacklist.delete(provider.name);
                    this.logger.log(`♻️ ${provider.name} ha sido eliminado de la lista negra.`);
                }, 300000);
            }
        }

        throw new Error("Sistema Crítico: Todas las IAs proveedoras están caídas.");
    }

    private removeIdReferences(text: string): string {
        return text.replace(/\b(ID|id|identificador|identificación)\b/gi, '').replace(/\s{2,}/g, ' ').trim();
    }

  private resolveTimeZone(timeZoneCandidate?: string): string {
    if (!timeZoneCandidate) {
      return this.defaultEmailTimeZone;
    }

    try {
      new Intl.DateTimeFormat('es-ES', { timeZone: timeZoneCandidate });
      return timeZoneCandidate;
    } catch {
      this.logger.warn(
        `Zona horaria inválida "${timeZoneCandidate}". Se usará ${this.defaultEmailTimeZone}.`,
      );
      return this.defaultEmailTimeZone;
    }
  }

  private normalizeDatesForPrompt(value: any, timeZone: string): any {
    if (Array.isArray(value)) {
      return value.map((item) => this.normalizeDatesForPrompt(item, timeZone));
    }

    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([key, nestedValue]) => [
          key,
          this.normalizeDatesForPrompt(nestedValue, timeZone),
        ]),
      );
    }

    if (typeof value === 'string' && this.isoDateRegex.test(value)) {
      return this.formatDateToLocalString(value, timeZone);
    }

    return value;
  }

  private formatDateToLocalString(isoDate: string, timeZone: string): string {
    const date = new Date(isoDate);

    if (Number.isNaN(date.getTime())) {
      return isoDate;
    }

    const datePart = new Intl.DateTimeFormat('es-ES', {
      timeZone,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);

    const timePart = new Intl.DateTimeFormat('es-ES', {
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);

    return `${datePart} ${timePart} (${timeZone})`;
  }

    private applyEmailStyles(body: string): string {
        return `
      <div style="font-family: Arial, sans-serif; color: #111111; background-color: #eef2fb; padding: 32px;">
        <div style="max-width: 700px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2f60cc 0%, #1a3c88 100%); border-radius: 24px 24px 0 0; padding: 22px 28px; color: #ffffff;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="width: 56px; height: 56px; border-radius: 18px; background: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 900; color: #2f60cc;">PC</div>
              <div>
                <div style="font-size: 20px; font-weight: 800; line-height: 1.1;">PoliCourt</div>
                <div style="font-size: 13px; opacity: 0.85; margin-top: 2px;">Notificación oficial</div>
              </div>
            </div>
          </div>

          <div style="background: #ffffff; border: 1px solid #dde3ef; border-top: none; border-radius: 0 0 24px 24px; box-shadow: 0 24px 50px rgba(15, 23, 42, 0.08); overflow: hidden;">
            <div style="padding: 34px 34px 28px; line-height: 1.7; font-size: 15px; color: #21243d;">
              ${body}
            </div>
            <div style="background: #f4f6fb; border-top: 1px solid #e5e9f0; padding: 18px 34px; font-size: 13px; color: #667085;">
              <p style="margin: 0;">Este es un mensaje automático de PoliCourt. Por favor, no respondas directamente a este correo.</p>
            </div>
          </div>
        </div>
      </div>`;
    }

    private async callGemini(prompt: string): Promise<string> {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return response.text || "{}";
    }

    private async callGroq(prompt: string): Promise<string> {
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: "json_object" }
        });
        return response.choices[0]?.message?.content || "{}";
    }
}