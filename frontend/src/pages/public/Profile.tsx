import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { MainLayout } from "@/layout/main";
import { HeaderPage } from "@/components/header-page";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/features/user/components/UserProfile";
import { UserEditDialog } from "@/features/user/components/UserEditDialog";
import { useProfileQuery } from "@/features/user/queries/useProfileQuery";
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
                        <UserProfile profile={profile} editable={false} />
                        {isOwner && (
                            <div className="mt-4 text-center flex flex-col gap-2 items-center">
                                <Button onClick={() => setIsEditOpen(true)} disabled={logoutAllMutation.isPending}>
                                    Editar mi perfil
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => logoutAllMutation.mutate()}
                                    disabled={logoutAllMutation.isPending}
                                >
                                    Cerrar sesión en todos los dispositivos
                                </Button>
                                {logoutAllMutation.isPending && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Cerrando sesiones...
                                    </p>
                                )}
                            </div>
                        )}
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
