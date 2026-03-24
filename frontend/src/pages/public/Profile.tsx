import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/features/auth/context/AuthContext";
import { MainLayout } from "@/layout/main";
import { HeaderPage } from "@/components/header-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserProfile } from "@/features/user/components/UserProfile";
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
                        <section className="mb-6 rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-500 text-white shadow-lg">
                            <div className="p-8">
                                <h2 className="text-3xl font-bold">{profile.firstName} {profile.lastName}</h2>
                                <p className="mt-1 text-sm opacity-90">@{profile.username}</p>
                                <p className="mt-4 text-sm opacity-95">
                                    {isOwner ? "Este es tu perfil. Actualiza tu información y revisa tus reservas recientes." : "Perfil público del usuario."}
                                </p>
                            </div>
                        </section>

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

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Reservas recientes</CardTitle>
                                <CardDescription>Últimas reservas del usuario</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isRentalsLoading ? (
                                    <div className="flex items-center justify-center py-14">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                                    </div>
                                ) : isRentalsError ? (
                                    <p className="text-center text-red-500">No se pudieron cargar las reservas.</p>
                                ) : rentals.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">No hay reservas para mostrar.</p>
                                ) : (
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {rentals.map((rental) => (
                                            <div key={rental.booking.uuid} className="rounded-xl border p-4 shadow-sm">
                                                <p className="text-xs text-muted-foreground">{rental.ticket.code}</p>
                                                <h3 className="text-lg font-semibold mt-1">{rental.booking.title || rental.booking.court?.name || "Reserva"}</h3>
                                                <p className="text-sm text-muted-foreground">{rental.booking.court?.name ?? "Pista no disponible"}</p>
                                                <p className="mt-2 text-sm">
                                                    <strong>Inicio:</strong> {new Date(rental.booking.startTime).toLocaleString("es-ES")}
                                                </p>
                                                <p className="text-sm">
                                                    <strong>Fin:</strong> {new Date(rental.booking.endTime).toLocaleString("es-ES")}
                                                </p>
                                                <p className="text-sm mt-2">
                                                    <strong>Estado:</strong> {rental.booking.status}
                                                </p>
                                                <p className="text-sm">
                                                    <strong>Total:</strong> {rental.booking.totalPrice?.toLocaleString("es-ES", { style: "currency", currency: "EUR" }) ?? "N/A"}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

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
