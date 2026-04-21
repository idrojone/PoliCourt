import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';

type EmailGenerationContext = {
  taskDescription: string;
  normalizedData: any;
  tone: string;
  timeZone: string;
};

type AiProvider = {
  name: string;
  execute: (prompt: string, context: EmailGenerationContext) => Promise<string>;
  isConfigured: () => boolean;
  temporaryBlacklistOnFailure?: boolean;
};

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly blacklist = new Set<string>();
  private readonly permanentlyDisabledProviders = new Set<string>();
  private readonly defaultEmailTimeZone = process.env.EMAIL_TIMEZONE || 'Europe/Madrid';
  private readonly isoDateRegex =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/;

  private readonly providers: AiProvider[] = [
    {
      name: 'Gemini',
      execute: async (prompt: string) => this.callGemini(prompt),
      isConfigured: () => Boolean(process.env.GEMINI_API_KEY?.trim()),
    },
    {
      name: 'Groq',
      execute: async (prompt: string) => this.callGroq(prompt),
      isConfigured: () => Boolean(process.env.GROQ_API_KEY?.trim()),
    },
    {
      name: 'Ollama',
      execute: async (prompt: string) => this.callOllama(prompt),
      isConfigured: () => (process.env.OLLAMA_ENABLED || 'true').toLowerCase() !== 'false',
    },
    {
      name: 'PlantillaLocal',
      execute: async (_prompt: string, context: EmailGenerationContext) =>
        this.callLocalTemplate(context),
      isConfigured: () => true,
      temporaryBlacklistOnFailure: false,
    },
  ];

  constructor() {
    const activeProviders = this.providers
      .filter((provider) => provider.isConfigured())
      .map((provider) => provider.name);

    this.logger.log(`Proveedores IA activos al iniciar: ${activeProviders.join(', ')}`);
  }

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
    const context: EmailGenerationContext = {
      taskDescription,
      normalizedData,
      tone,
      timeZone,
    };

    const prompt = `
      Eres el sistema automatizado del polideportivo "PoliCourt".
      Redacta un correo electronico para un socio.
      Tono: ${tone}.

      Situacion: ${taskDescription}
      Zona horaria de referencia para todo el correo: ${timeZone}
      Datos adicionales (ya normalizados en hora local): ${JSON.stringify(normalizedData)}

      Reglas obligatorias sobre horarios:
      - No conviertas zonas horarias ni restes/sumes horas.
      - No pases horarios a UTC o GMT.
      - Si recibes un rango de hora de inicio y fin, respetalo exactamente.

      Usa siempre el mismo estilo CSS inline para todo el cuerpo del correo: fuente Arial, color #111, fondo blanco, espaciado comodo y texto legible.
      El mensaje debe tener un diseno corporativo y elegante: fondo general suave, tarjeta blanca centrada con sombra ligera, cabecera con logo/identidad de PoliCourt y bloques de contenido bien estructurados.
      No incluyas ninguna referencia a ID, identificador, numero interno, ni campos de identificacion en el asunto o el cuerpo.

      Devuelve UNICAMENTE un objeto JSON valido con este formato exacto:
      {
        "subject": "Asunto corto y claro",
        "body": "Cuerpo del correo en formato HTML, usa etiquetas <p>, <strong>, <br>. Se directo."
      }
    `;

    for (const provider of this.providers) {
      if (!provider.isConfigured()) {
        this.logger.warn(`Saltando ${provider.name}: proveedor no configurado.`);
        continue;
      }

      if (this.permanentlyDisabledProviders.has(provider.name)) {
        this.logger.warn(`Saltando ${provider.name}: deshabilitado por error de autenticacion.`);
        continue;
      }

      if (this.blacklist.has(provider.name)) {
        this.logger.warn(`Saltando ${provider.name}: proveedor en blacklist temporal.`);
        continue;
      }

      try {
        this.logger.log(`Generando contenido con proveedor ${provider.name}...`);
        const jsonString = await provider.execute(prompt, context);
        const result = this.parseProviderResponse(jsonString);

        return {
          subject: this.removeIdReferences(result.subject),
          body: this.applyEmailStyles(this.removeIdReferences(result.body)),
        };
      } catch (error: any) {
        const errorMessage = this.formatError(error);

        if (this.isAuthenticationError(errorMessage)) {
          this.logger.error(
            `Fallo permanente en ${provider.name} por autenticacion: ${errorMessage}. Se deshabilita hasta reinicio.`,
          );
          this.permanentlyDisabledProviders.add(provider.name);
          continue;
        }

        this.logger.error(`Fallo en ${provider.name}: ${errorMessage}.`);

        if (provider.temporaryBlacklistOnFailure !== false) {
          this.temporarilyBlacklistProvider(provider.name);
        }
      }
    }

    throw new Error('Sistema critico: todos los proveedores IA fallaron.');
  }

  private parseProviderResponse(raw: string): { subject: string; body: string } {
    const extractedJson = this.extractJsonObject(raw);
    const parsed = JSON.parse(extractedJson) as Partial<{ subject: string; body: string }>;

    if (typeof parsed.subject !== 'string' || typeof parsed.body !== 'string') {
      throw new Error('El proveedor devolvio un JSON sin subject/body.');
    }

    return {
      subject: parsed.subject,
      body: parsed.body,
    };
  }

  private extractJsonObject(raw: string): string {
    const text = (raw || '').trim();

    if (!text) {
      throw new Error('Respuesta vacia del proveedor IA.');
    }

    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (codeBlockMatch?.[1]) {
      return codeBlockMatch[1].trim();
    }

    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return text.slice(firstBrace, lastBrace + 1);
    }

    return text;
  }

  private temporarilyBlacklistProvider(providerName: string): void {
    this.logger.warn(`Anadiendo ${providerName} a blacklist temporal por 5 minutos.`);
    this.blacklist.add(providerName);

    setTimeout(() => {
      this.blacklist.delete(providerName);
      this.logger.log(`${providerName} eliminado de blacklist temporal.`);
    }, 300000);
  }

  private isAuthenticationError(message: string): boolean {
    const normalized = message.toLowerCase();
    return (
      normalized.includes('invalid api key') ||
      normalized.includes('invalid_api_key') ||
      normalized.includes('unauthorized') ||
      normalized.includes('401') ||
      normalized.includes('403')
    );
  }

  private formatError(error: any): string {
    if (!error) {
      return 'Error desconocido';
    }

    if (typeof error === 'string') {
      return error;
    }

    if (error instanceof Error) {
      return error.message;
    }

    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }

  private removeIdReferences(text: string): string {
    return text
      .replace(/\b(ID|id|identificador|identificacion)\b/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
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
        `Zona horaria invalida "${timeZoneCandidate}". Se usara ${this.defaultEmailTimeZone}.`,
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
                <div style="font-size: 13px; opacity: 0.85; margin-top: 2px;">Notificacion oficial</div>
              </div>
            </div>
          </div>

          <div style="background: #ffffff; border: 1px solid #dde3ef; border-top: none; border-radius: 0 0 24px 24px; box-shadow: 0 24px 50px rgba(15, 23, 42, 0.08); overflow: hidden;">
            <div style="padding: 34px 34px 28px; line-height: 1.7; font-size: 15px; color: #21243d;">
              ${body}
            </div>
            <div style="background: #f4f6fb; border-top: 1px solid #e5e9f0; padding: 18px 34px; font-size: 13px; color: #667085;">
              <p style="margin: 0;">Este es un mensaje automatico de PoliCourt. Por favor, no respondas directamente a este correo.</p>
            </div>
          </div>
        </div>
      </div>`;
  }

  private callLocalTemplate(context: EmailGenerationContext): Promise<string> {
    const subject = this.buildSubjectFromTask(context.taskDescription);
    const details = this.renderDetailsHtml(context.normalizedData);

    const body = `
      <p>Hola,</p>
      <p>Te contactamos desde PoliCourt para actualizarte sobre la siguiente gestion:</p>
      <p><strong>${this.escapeHtml(context.taskDescription)}</strong></p>
      ${details}
      <p>Zona horaria de referencia: <strong>${this.escapeHtml(context.timeZone)}</strong></p>
      <p>Si tenes dudas, responde a este correo y te ayudamos.</p>
      <p>Saludos,<br><strong>Equipo PoliCourt</strong></p>
    `;

    return Promise.resolve(JSON.stringify({ subject, body }));
  }

  private buildSubjectFromTask(taskDescription: string): string {
    const normalizedTask = taskDescription.trim();
    if (!normalizedTask) {
      return 'Actualizacion de PoliCourt';
    }

    if (normalizedTask.length <= 70) {
      return `PoliCourt: ${normalizedTask}`;
    }

    return `PoliCourt: ${normalizedTask.slice(0, 67)}...`;
  }

  private renderDetailsHtml(data: any): string {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return '';
    }

    const entries = Object.entries(data).slice(0, 8);
    if (!entries.length) {
      return '';
    }

    const items = entries
      .map(([key, value]) => {
        const label = this.humanizeKey(key);
        const safeValue = this.escapeHtml(this.stringifyValue(value));
        return `<li><strong>${this.escapeHtml(label)}:</strong> ${safeValue}</li>`;
      })
      .join('');

    return `<p>Detalle:</p><ul>${items}</ul>`;
  }

  private humanizeKey(raw: string): string {
    return raw
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private stringifyValue(value: unknown): string {
    if (value === null || value === undefined) {
      return '-';
    }

    if (typeof value === 'object') {
      return JSON.stringify(value);
    }

    return String(value);
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  private async callGemini(prompt: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY no configurada.');
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    return response.text || '{}';
  }

  private async callGroq(prompt: string): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY?.trim();
    if (!apiKey) {
      throw new Error('GROQ_API_KEY no configurada.');
    }

    const groq = new Groq({ apiKey });
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    return response.choices[0]?.message?.content || '{}';
  }

  private async callOllama(prompt: string): Promise<string> {
    const baseUrl = (process.env.OLLAMA_BASE_URL || 'http://localhost:11434').replace(/\/$/, '');
    const model = process.env.OLLAMA_MODEL || 'qwen2.5:3b';

    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        format: 'json',
      }),
    });

    if (!response.ok) {
      const responseBody = await response.text();
      throw new Error(`HTTP ${response.status} en Ollama: ${responseBody}`);
    }

    const parsed = (await response.json()) as { response?: string };
    if (!parsed.response) {
      throw new Error('Ollama no devolvio campo response.');
    }

    return parsed.response;
  }
}