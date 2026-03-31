import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { MainLayout } from "@/layout/main";
import { ProfileHeader } from "@/features/user/components/ProfileHeader";
import { ProfileActions } from "@/features/user/components/ProfileActions";
import { ProfileRentals } from "@/features/user/components/ProfileRentals";
import { UserEditDialog } from "@/features/user/components/UserEditDialog";
import { useProfileQuery } from "@/features/user/queries/useProfileQuery";
import { useUserRentalsQuery } from "@/features/user/queries/useUserRentalsQuery";
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

    const rentals = rentalsPage?.content || [];
    const fullName = profile
        ? `${profile.firstName} ${profile.lastName}`
        : "Perfil de usuario";

    return (
        <MainLayout>
            <section className="relative overflow-hidden border-b border-border bg-background">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.03)_35%,transparent_70%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.02)_35%,transparent_70%)]" />
                <div className="relative container mx-auto px-4 py-10">
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        Zona de perfil
                    </p>
                    <h1 className="mt-3 text-3xl font-black text-foreground md:text-4xl">
                        {fullName}
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
                        {isOwner
                            ? "Gestiona tu información personal, controla tus sesiones activas y revisa todo tu historial de reservas en un solo panel."
                            : "Consulta los datos públicos y la actividad visible del usuario dentro de PoliCourt."}
                    </p>
                </div>
            </section>

            <div className="relative overflow-hidden bg-background py-8">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.05)_0%,transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.03)_0%,transparent_30%)]" />
                <div className="relative container mx-auto px-4">
                {isLoading ? (
                    <div className="flex min-h-[40vh] items-center justify-center rounded-3xl border border-border bg-card/80">
                        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
                    </div>
                ) : isError ? (
                    <div className="rounded-3xl border border-destructive/40 bg-destructive/10 py-16 text-center">
                        <p className="mb-2 text-destructive">
                            No se pudo cargar el perfil.
                        </p>
                    </div>
                ) : profile ? (
                    <>
                        <ProfileHeader profile={profile} isOwner={isOwner} />

                        <section className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-lg md:p-8">
                            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
                                <div>
                                    <h2 className="text-xl font-black text-card-foreground">Ficha del perfil</h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Información general del usuario dentro de la plataforma.
                                    </p>
                                </div>
                                <span className="inline-flex items-center rounded-full border border-border bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                                    {profile.role}
                                </span>
                            </div>

                            <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-3 text-sm text-card-foreground">
                                    <p><span className="font-semibold text-foreground">Nombre:</span> {profile.firstName} {profile.lastName}</p>
                                    <p><span className="font-semibold text-foreground">Usuario:</span> @{profile.username}</p>
                                    <p><span className="font-semibold text-foreground">Correo:</span> {profile.email}</p>
                                    <p><span className="font-semibold text-foreground">Teléfono:</span> {profile.phone || "No disponible"}</p>
                                </div>
                                <div className="space-y-3 text-sm text-card-foreground">
                                    <p><span className="font-semibold text-foreground">Nacimiento:</span> {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString("es-ES") : "No disponible"}</p>
                                    <p><span className="font-semibold text-foreground">Género:</span> {profile.gender || "No especificado"}</p>
                                    <p><span className="font-semibold text-foreground">Estado:</span> {profile.status}</p>
                                    <p><span className="font-semibold text-foreground">Activo:</span> {profile.isActive ? "Sí" : "No"}</p>
                                    <p><span className="font-semibold text-foreground">Email verificado:</span> {profile.isEmailVerified ? "Sí" : "No"}</p>
                                </div>
                            </div>
                        </section>

                        <ProfileActions
                            isOwner={isOwner}
                            onEdit={() => setIsEditOpen(true)}
                            onLogoutAll={() => logoutAllMutation.mutate()}
                            isPending={logoutAllMutation.isPending}
                        />

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
                    <div className="rounded-3xl border border-border bg-card py-16 text-center">
                        <p className="text-muted-foreground">
                            Usuario no encontrado
                        </p>
                    </div>
                )}
                </div>
            </div>
        </MainLayout>
    );
};
