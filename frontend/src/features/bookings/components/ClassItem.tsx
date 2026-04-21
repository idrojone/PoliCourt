import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EditClassForm from "./EditClassForm";
import { formatFullDateTime, formatTimeRange } from "@/lib";
import type { BookingResponse } from "@/features/types/bookings/BookingRecord";
import { useDeleteBookingMutation } from "@/features/bookings/mutations/useDeleteBookingMutation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { ClassEnrollmentPaymentDialog } from "./ClassEnrollmentPaymentDialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

type Props = {
  item: BookingResponse;
  showActions?: boolean;
  isEnrolled?: boolean;
};

const ClassItem: React.FC<Props> = ({ item, showActions = true, isEnrolled = false }) => {
  const [open, setOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [enrollOpen, setEnrollOpen] = useState(false);
  const deleteMutation = useDeleteBookingMutation();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();
  const username = user?.username;

  const handleConfirmDelete = () => {
    if (!item.uuid || !username) return;
    deleteMutation.mutate({ uuid: item.uuid, username }, {
      onSuccess: () => {
        setConfirmDeleteOpen(false);
      },
    });
  };

  const handleEnroll = () => {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }
    setEnrollOpen(true);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{item.title || "(Sin título)"}</CardTitle>
        {showActions && (
          <CardAction>
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => setOpen(true)}>Editar</Button>
              <Button variant="destructive" onClick={() => setConfirmDeleteOpen(true)} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
              </Button>
            </div>
          </CardAction>
        )}
        <CardDescription>{item.sport?.name || item.court?.sports?.[0]?.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Pista</div>
            <div className="font-medium">{item.court?.name || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Organizador</div>
            <div className="font-medium">{item.organizer?.fullName || item.organizer?.username || "-"}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Horario</div>
            <div className="font-medium">{item.startTime && item.endTime ? formatTimeRange(item.startTime, item.endTime) : "-"}</div>
            <div className="text-xs text-muted-foreground">{item.startTime ? formatFullDateTime(item.startTime) : ""}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Precio por asistente</div>
            <div className="font-medium">{item.attendeePrice != null ? `${item.attendeePrice} €` : "-"}</div>
          </div>
        </div>
        {item.description && <div className="mt-4 text-sm text-muted-foreground">{item.description}</div>}
      </CardContent>

      {!showActions && (
        <div className="px-6 pb-6">
          <Button
            onClick={handleEnroll}
            disabled={item.attendeePrice == null || isEnrolled}
            className="w-full"
          >
            {isEnrolled ? "Ya estás inscrito" : user ? "Inscribirme" : "Iniciar sesión para inscribirme"}
          </Button>
        </div>
      )}

      <ClassEnrollmentPaymentDialog
        open={enrollOpen}
        bookingUuid={item.uuid ?? null}
        onOpenChange={setEnrollOpen}
        onFinished={() => setEnrollOpen(false)}
      />

      {showActions && (
        <>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Editar clase</DialogTitle>
              </DialogHeader>
              {open && (
                <EditClassForm initial={item} onSuccess={() => setOpen(false)} onCancel={() => setOpen(false)} />
              )}
            </DialogContent>
          </Dialog>

          <AlertDialog open={confirmDeleteOpen} onOpenChange={(o) => !o && setConfirmDeleteOpen(false)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
                <AlertDialogDescription>¿Deseas eliminar esta clase? Esta acción no se puede deshacer.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleteMutation.isPending}>Volver</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmDelete} disabled={deleteMutation.isPending} className="bg-destructive text-destructive-foreground">
                  {deleteMutation.isPending ? "Eliminando..." : "Sí, eliminar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </Card>
  );
};

export default ClassItem;
