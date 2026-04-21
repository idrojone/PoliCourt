import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { MainLayout } from "@/layout/main";
import { ProfileHeader } from "@/features/user/components/ProfileHeader";
import { ProfileActions } from "@/features/user/components/ProfileActions";
import { ProfileRentals } from "@/features/user/components/ProfileRentals";
import { ProfileClassEnrollments } from "@/features/user/components/ProfileClassEnrollments";
import { UserEditDialog } from "@/features/user/components/UserEditDialog";
import { useProfileQuery } from "@/features/user/queries/useProfileQuery";
import { useUserRentalsQuery } from "@/features/user/queries/useUserRentalsQuery";
import { useUserClassEnrollmentsQuery } from "@/features/user/queries/useUserClassEnrollmentsQuery";
import { useLogoutAllMutation } from "@/features/auth/mutations/useLogoutAllMutation";


export const Profile = () => {
    const { username } = useParams<{ username: string }>();
    const { user: authUser } = useAuth();
    const {
        data: profile,
        isLoading,
        isError,
    } = useProfileQuery(username);

    const isOwner = authUser?.username === username;
    const [isEditOpen, setIsEditOpen] = useState(false);

    const logoutAllMutation = useLogoutAllMutation();

    const {
        data: rentalsPage,
        isLoading: isRentalsLoading,
        isError: isRentalsError,
    } = useUserRentalsQuery(username);

    const {
        data: classEnrollments,
        isLoading: isEnrollmentsLoading,
        isError: isEnrollmentsError,
    } = useUserClassEnrollmentsQuery(username, isOwner);

    const rentals = rentalsPage?.content || [];
    const fullName = profile
        ? `${profile.firstName} ${profile.lastName}`
        : "Perfil de usuario";

    return (
        <MainLayout>
            <section className="relative overflow-hidden border-b border-slate-200/80 bg-slate-50 text-slate-900 dark:border-white/10 dark:bg-slate-950 dark:text-white">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.18)_0%,transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.25)_0%,transparent_55%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(248,250,252,0.9)_15%,rgba(226,232,240,0.6)_60%,rgba(248,250,252,0.95)_95%)] dark:bg-[linear-gradient(120deg,rgba(2,6,23,0.85)_15%,rgba(2,6,23,0.3)_60%,rgba(2,6,23,0.9)_95%)]" />
                <div className="relative container mx-auto px-4 py-12">
                    <p className="text-xs uppercase tracking-[0.35em] text-cyan-700/70 dark:text-cyan-200/70">
                        Zona de perfil
                    </p>
                    <h1 className="mt-4 text-4xl font-black uppercase tracking-[0.08em] md:text-6xl">
                        {fullName}
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm text-slate-700/90 dark:text-slate-200/85 md:text-base">
                        {isOwner
                            ? "Gestiona tu informacion personal, controla tus sesiones activas y revisa todo tu historial de reservas en un solo panel."
                            : "Consulta los datos publicos y la actividad visible del usuario dentro de PoliCourt."}
                    </p>
                </div>
                <div className="pointer-events-none absolute -bottom-8 right-6 hidden text-5xl font-black uppercase tracking-[0.2em] text-slate-900/10 dark:text-white/10 md:block">
                    {fullName}
                </div>
            </section>

            <div className="relative overflow-hidden bg-slate-50 py-10 text-slate-900 dark:bg-slate-950 dark:text-white">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(14,165,233,0.14)_0%,transparent_35%),radial-gradient(circle_at_80%_10%,rgba(132,204,22,0.1)_0%,transparent_30%)] dark:bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.18)_0%,transparent_35%),radial-gradient(circle_at_80%_10%,rgba(163,230,53,0.12)_0%,transparent_30%)]" />
                <div className="relative container mx-auto px-4">
                {isLoading ? (
                    <div className="flex min-h-[40vh] items-center justify-center rounded-3xl border border-slate-200/80 bg-white/80 dark:border-white/10 dark:bg-slate-950/70">
                        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-cyan-300"></div>
                    </div>
                ) : isError ? (
                    <div className="rounded-3xl border border-rose-300/60 bg-rose-100/60 py-16 text-center dark:border-rose-400/40 dark:bg-rose-500/10">
                        <p className="mb-2 text-rose-600 dark:text-rose-200">
                            No se pudo cargar el perfil.
                        </p>
                    </div>
                ) : profile ? (
                    <>
                        <ProfileHeader profile={profile} isOwner={isOwner} />

                        <section className="mt-6 rounded-3xl border border-cyan-300/30 bg-white/80 p-6 text-slate-900 shadow-[0_20px_45px_rgba(15,23,42,0.12)] dark:border-cyan-400/20 dark:bg-slate-950/70 dark:text-white dark:shadow-[0_0_35px_rgba(56,189,248,0.15)] md:p-8">
                            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200/80 pb-4 dark:border-white/10">
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white">Ficha del perfil</h2>
                                    <p className="mt-1 text-sm text-slate-600/80 dark:text-slate-200/70">
                                        Información general del usuario dentro de la plataforma.
                                    </p>
                                </div>
                                <span className="inline-flex items-center rounded-full border border-cyan-400/30 bg-cyan-100/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-800 dark:border-cyan-300/30 dark:bg-cyan-300/10 dark:text-cyan-100">
                                    {profile.role}
                                </span>
                            </div>

                            <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200/80">
                                    <p><span className="font-semibold text-slate-900 dark:text-white">Nombre:</span> {profile.firstName} {profile.lastName}</p>
                                    <p><span className="font-semibold text-slate-900 dark:text-white">Usuario:</span> @{profile.username}</p>
                                    <p><span className="font-semibold text-slate-900 dark:text-white">Correo:</span> {profile.email}</p>
                                    <p><span className="font-semibold text-slate-900 dark:text-white">Telefono:</span> {profile.phone || "No disponible"}</p>
                                </div>
                                <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200/80">
                                    <p><span className="font-semibold text-slate-900 dark:text-white">Nacimiento:</span> {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString("es-ES") : "No disponible"}</p>
                                    <p><span className="font-semibold text-slate-900 dark:text-white">Genero:</span> {profile.gender || "No especificado"}</p>
                                    <p><span className="font-semibold text-slate-900 dark:text-white">Estado:</span> {profile.status}</p>
                                    <p><span className="font-semibold text-slate-900 dark:text-white">Activo:</span> {profile.isActive ? "Sí" : "No"}</p>
                                    <p><span className="font-semibold text-slate-900 dark:text-white">Email verificado:</span> {profile.isEmailVerified ? "Sí" : "No"}</p>
                                </div>
                            </div>
                        </section>

                        <ProfileActions
                            isOwner={isOwner}
                            onEdit={() => setIsEditOpen(true)}
                            onLogoutAll={() => logoutAllMutation.mutate()}
                            isPending={logoutAllMutation.isPending}
                        />

                        {isOwner && (
                            <ProfileClassEnrollments
                                enrollments={classEnrollments || []}
                                isLoading={isEnrollmentsLoading}
                                isError={isEnrollmentsError}
                            />
                        )}

                        <ProfileRentals
                            rentals={rentals}
                            isLoading={isRentalsLoading}
                            isError={isRentalsError}
                            isOwner={isOwner}
                            requestUsername={authUser?.username}
                        />

                        {isOwner && (
                            <UserEditDialog
                                user={profile}
                                open={isEditOpen}
                                onOpenChange={setIsEditOpen}
                            />
                        )}
                    </>
                ) : (
                    <div className="rounded-3xl border border-slate-200/80 bg-white/80 py-16 text-center dark:border-white/10 dark:bg-slate-950/70">
                        <p className="text-slate-600 dark:text-slate-200/70">
                            Usuario no encontrado
                        </p>
                    </div>
                )}
                </div>
            </div>
        </MainLayout>
    );
};
