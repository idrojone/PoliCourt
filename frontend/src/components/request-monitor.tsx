import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/context/AuthContext";
import { getToken } from "@/lib/token";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const fileMimeTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

const MAX_FILES = 5;

const requestMonitorSchema = z.object({
  description: z
    .string()
    .min(10, "Describe brevemente por qué quieres ser monitor y tu experiencia.")
    .max(1000, "La descripción no puede superar los 1000 caracteres."),
});

type RequestMonitorFormValues = z.infer<typeof requestMonitorSchema>;

export function RequestMonitor() {
  const { isAuthenticated, isInitializing, user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RequestMonitorFormValues>({
    resolver: zodResolver(requestMonitorSchema),
    defaultValues: {
      description: "",
    },
  });

  if (isInitializing) {
    return (
      <Card className="glass-card max-w-4xl border-white/10 bg-card/70">
        <CardHeader>
          <CardTitle>Verificando tu sesión...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Un momento, por favor.</p>
        </CardContent>
      </Card>
    );
  }

  if (!isAuthenticated) {
    return (
      <Card className="glass-card max-w-4xl border-white/10 bg-card/70">
        <CardHeader>
          <CardTitle>Necesitas iniciar sesión</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>Para enviar la solicitud como monitor, por favor registra tu cuenta o inicia sesión.</p>
          <div className="flex gap-2">
            <Button asChild className="bg-[linear-gradient(135deg,#7dd3fc_0%,#4fd1ff_45%,#5eead4_100%)] text-[#001f2e] shadow-[0_0_16px_rgba(125,211,252,0.2)]">
              <Link to="/register">Registrarse</Link>
            </Button>
            <Button asChild variant="secondary" className="border-white/10 bg-card/60 text-foreground">
              <Link to="/login">Iniciar sesión</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (user?.role === "MONITOR") {
    return (
      <Card className="glass-card max-w-4xl border-white/10 bg-card/70">
        <CardHeader>
          <CardTitle>Ya eres monitor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>Ya estás registrado como monitor. Gracias por colaborar con la comunidad.</p>
        </CardContent>
      </Card>
    );
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files ? Array.from(event.target.files) : [];
    if (!selected.length) {
      return;
    }

    const invalidFiles = selected.filter((file) => !fileMimeTypes.includes(file.type));
    const validFiles = selected.filter((file) => fileMimeTypes.includes(file.type));

    if (invalidFiles.length) {
      toast.error(
        `Los archivos ${invalidFiles
          .map((file) => file.name)
          .join(", ")} no son PDF o imagen (png/jpg/webp).`
      );
    }

    const nextFiles = [...files, ...validFiles].slice(0, MAX_FILES);

    if (files.length + validFiles.length > MAX_FILES) {
      toast.error(`Se permite un máximo de ${MAX_FILES} archivos.`);
    }

    setFiles(nextFiles);
    event.target.value = "";
  };

  const onSubmit = async (values: RequestMonitorFormValues) => {
    if (!files.length) {
      setSubmitError("Debes subir al menos un documento que avale tu experiencia o certificación.");
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("description", values.description);

      files.forEach((file) => {
        formData.append("diplomas", file);
      });

      const authToken = getToken();
      if (!authToken) {
        throw new Error("No se encontró token de autenticación. Inicia sesión nuevamente.");
      }

      await axios.post("http://localhost:4002/monitor/apply", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
        withCredentials: true,
      });

      toast.success("Solicitud enviada. Evaluaremos tu perfil y te contactaremos pronto.");
      form.reset();
      setFiles([]);
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setSubmitError("Debes iniciar sesión para enviar la solicitud. Regístrate o inicia sesión e inténtalo de nuevo.");
      } else {
        setSubmitError("No se pudo enviar la solicitud. Intenta nuevamente más tarde.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles((current) => current.filter((_, idx) => idx !== index));
  };

  return (
    <Card className="glass-card max-w-4xl border-white/10 bg-card/70">
      <CardHeader>
        <CardTitle>Solicitud para ser monitor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Sube hasta {MAX_FILES} archivos (PDF o imágenes) que acrediten tu experiencia
          deportiva (diplomas, certificaciones, etc.) y describe tu propuesta.
        </p>

        {submitError && (
          <Alert variant="destructive" className="border-white/10 bg-card/60 text-red-300">
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explica tu experiencia, deportes preferidos y por qué quieres ser monitor..."
                      rows={4}
                      className="border-white/10 bg-card/60"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Archivos respaldatorios</FormLabel>
              <Input
                type="file"
                multiple
                accept=".pdf,image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileChange}
                className="border-white/10 bg-card/60"
              />
              <p className="text-xs text-muted-foreground">Etiquetas recomendadas: diploma, certificado, credencial.</p>
            </div>

            {files.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {files.map((file, index) => (
                  <Badge key={`${file.name}-${index}`} variant="secondary" className="flex items-center gap-2 border-white/10 bg-card/60 text-foreground">
                    <span>{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="underline text-xs"
                    >
                      Quitar
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[linear-gradient(135deg,#7dd3fc_0%,#4fd1ff_45%,#5eead4_100%)] text-[#001f2e] shadow-[0_0_16px_rgba(125,211,252,0.2)]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enviando solicitud..." : "Enviar solicitud"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
