import { RegisterForm } from "@/features/auth/components/RegisterForm";
import modernFacilityImage from "@/assets/tennis-court-indoor-clay-surface-professional.jpg";
import { MainLayout } from "@/layout/main";

export const Register = () => {
  return (
    <MainLayout>
      <section
        className="relative min-h-screen overflow-hidden bg-cover bg-center text-slate-900 dark:text-white"
        style={{ backgroundImage: `url(${modernFacilityImage})` }}
      >
        <div className="absolute inset-0 bg-white/60 dark:bg-slate-950/75" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(14,165,233,0.12)_0%,transparent_60%)] dark:bg-[radial-gradient(circle_at_75%_20%,rgba(34,211,238,0.35)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_75%,rgba(132,204,22,0.12)_0%,transparent_60%)] dark:bg-[radial-gradient(circle_at_20%_75%,rgba(132,204,22,0.22)_0%,transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(248,250,252,0.7)_10%,rgba(226,232,240,0.4)_55%,rgba(248,250,252,0.75)_90%)] dark:bg-[linear-gradient(120deg,rgba(2,6,23,0.75)_10%,rgba(2,6,23,0.3)_55%,rgba(2,6,23,0.85)_90%)]" />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col-reverse items-start justify-center gap-10 px-6 py-16 lg:flex-row lg:items-center">
          <div className="w-full max-w-md">
            <RegisterForm />
          </div>

          <div className="max-w-xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-lime-500/30 bg-lime-200/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-lime-900/80 dark:border-lime-300/30 dark:bg-lime-300/10 dark:text-lime-100">
              Nuevo ingreso
            </span>
            <h1 className="text-4xl font-black uppercase leading-tight md:text-6xl">
              PoliCourt: tu juego, tu pasion.
            </h1>
            <p className="text-sm text-slate-700/90 dark:text-slate-200/90 md:text-base">
              Registra tu cuenta y domina cada pista. Reserva, comparte horarios y construye tu
              historial deportivo desde un solo panel.
            </p>
            <div className="grid gap-3 text-xs uppercase tracking-[0.2em] text-slate-600 dark:text-slate-300 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:shadow-none">
                Registro en menos de 2 minutos
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:shadow-none">
                Control total de tus sesiones
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};
