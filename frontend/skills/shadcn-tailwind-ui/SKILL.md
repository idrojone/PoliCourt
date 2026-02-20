---
name: shadcn-tailwind-ui
description: Úsala cuando necesites crear o modificar la interfaz gráfica, añadir estilos o usar componentes visuales.
---

# Convenciones de UI (Shadcn & Tailwind CSS)

El proyecto utiliza **Tailwind CSS** para los estilos y **Shadcn/UI** como sistema de componentes base.

## Reglas Estrictas:
1. **Prioridad de Componentes:** Antes de crear un componente desde cero (ej. un modal, un botón, un dropdown), revisa la carpeta `src/components/ui/`. Ya tenemos implementados `dialog.tsx`, `button.tsx`, `form.tsx`, etc. **Debes usarlos.**
2. **Estilizado:** Usa exclusivamente clases de Tailwind CSS. Está estrictamente prohibido usar CSS en línea (`style={{...}}`) o crear archivos `.css` nuevos a menos que sea absolutamente indispensable.
3. **Íconos:** Usa la librería `lucide-react`. No instales otras librerías de íconos.
4. **Formularios:** Todos los formularios deben construirse utilizando la integración de `react-hook-form` con `@hookform/resolvers/zod` y el componente `<Form />` de `src/components/ui/form.tsx`.