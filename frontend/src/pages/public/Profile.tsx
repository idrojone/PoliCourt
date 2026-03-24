import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { MainLayout } from "@/layout/main";
import { HeaderPage } from "@/components/header-page";
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

    return (
        <MainLayout>
            <HeaderPage
                title={
                    profile
                        ? `${profile.firstName} ${profile.lastName}`
                        : "Perfil de usuario"
                }
                description={
                    isOwner
                        ? "Edita tu información personal"
                        : "Consulta los datos públicos del usuario"
                }
            />

            <div className="container mx-auto px-4 py-8">
                {isLoading ? (
                    <div className="flex items-center justify-center min-h-50">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : isError ? (
                    <div className="text-center py-20">
                        <p className="text-red-500 mb-2">
                            No se pudo cargar el perfil.
                        </p>
                    </div>
                ) : profile ? (
                    <>
                        <ProfileHeader profile={profile} isOwner={isOwner} />

                        <section className="mt-6 rounded-2xl border border-indigo-100 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-800">Perfil completo</h2>
                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-2 text-sm text-slate-700">
                                    <p><span className="font-medium">Nombre:</span> {profile.firstName} {profile.lastName}</p>
                                    <p><span className="font-medium">Usuario:</span> @{profile.username}</p>
                                    <p><span className="font-medium">Correo:</span> {profile.email}</p>
                                    <p><span className="font-medium">Teléfono:</span> {profile.phone || "No disponible"}</p>
                                </div>
                                <div className="space-y-2 text-sm text-slate-700">
                                    <p><span className="font-medium">Nacimiento:</span> {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString("es-ES") : "No disponible"}</p>
                                    <p><span className="font-medium">Género:</span> {profile.gender || "No especificado"}</p>
                                    <p><span className="font-medium">Rol:</span> {profile.role}</p>
                                    <p><span className="font-medium">Estado:</span> {profile.status}</p>
                                    <p><span className="font-medium">Activo:</span> {profile.isActive ? "Sí" : "No"}</p>
                                    <p><span className="font-medium">Email verificado:</span> {profile.isEmailVerified ? "Sí" : "No"}</p>
                                </div>
                            </div>
                        </section>

                        <ProfileActions
                            isOwner={isOwner}
                            onEdit={() => setIsEditOpen(true)}
                            onLogoutAll={() => logoutAllMutation.mutate()}
                            isPending={logoutAllMutation.isPending}
                        />

                        <ProfileRentals rentals={rentals} isLoading={isRentalsLoading} isError={isRentalsError} />

                        {isOwner && (
                            <UserEditDialog
                                user={profile}
                                open={isEditOpen}
                                onOpenChange={setIsEditOpen}
                            />
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground">
                            Usuario no encontrado
                        </p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};
