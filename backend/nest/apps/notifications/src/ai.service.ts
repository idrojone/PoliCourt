import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import Groq from 'groq-sdk';

@Injectable()
export class AiService {
    private readonly logger = new Logger(AiService.name);
    private blacklist = new Set<string>();

    private providers = [
        { name: 'Gemini', execute: (prompt: string) => this.callGemini(prompt) },
        { name: 'Groq', execute: (prompt: string) => this.callGroq(prompt) }
    ];

    async generateEmailContent(taskDescription: string, data: any, tone: string = 'Profesional') {
        const prompt = `
      Eres el sistema automatizado del polideportivo "PoliCourt".
      Redacta un correo electrónico para un socio.
      Tono: ${tone}.
      
      Situación: ${taskDescription}
      Datos adicionales: ${JSON.stringify(data)}

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
                return JSON.parse(jsonString) as { subject: string; body: string };
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