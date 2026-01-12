import { parseArgs } from "util";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const { values } = parseArgs({
  args: Bun.argv,
  options: {
    promt: { type: "string" },
  },
  strict: false,
});

const promptTexto = values.promt;

if (!promptTexto) {
  console.error("Error: Debes usar --promt \"tu idea aquí\"");
  process.exit(1);
}

async function generarImagen() {
  const outputDir = "src/assets";
  const fileName = `ai_img_${Date.now()}`;
  
  const width = 1024;
  const height = 1024;
  const seed = Math.floor(Math.random() * 999999);
  
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptTexto)}?width=${width}&height=${height}&seed=${seed}&model=flux&nologo=true`;

  try {
    console.log(`Generando: "${promptTexto}"...`);
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("No se pudo obtener la imagen de la API");

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    await mkdir(outputDir, { recursive: true });

    const jpgPath = path.join(outputDir, `${fileName}.jpg`);
    await Bun.write(jpgPath, buffer);
    console.log(`Imagen JPG guardada: ${jpgPath}`);

    const svgPath = path.join(outputDir, `${fileName}.svg`);
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="100%" height="100%" fill="#eee"/>
      <image href="data:image/jpeg;base64,${base64Image}" width="${width}" height="${height}"/>
    </svg>`;
    
    await Bun.write(svgPath, svgContent);
    console.log(`Imagen SVG guardada: ${svgPath}`);

  } catch (error) {
    console.error("Error en la generación:", error.message);
  }
}

generarImagen();