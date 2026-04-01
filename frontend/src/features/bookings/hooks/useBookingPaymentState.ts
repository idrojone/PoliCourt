import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCreateBookingIntentMutation } from "@/features/bookings/mutations/useCreateBookingIntentMutation";
import { BookingStatus } from "@/features/types/bookings/BookingRecord";
import type { BookingDraft } from "@/features/bookings/components/booking-flow/types";
import { pollBookingStatus } from "@/features/bookings/components/booking-flow/utils";

type Params = {
  open: boolean;
  draft: BookingDraft | null;
  onOpenChange: (open: boolean) => void;
  onFinished: () => void;
};

type Return = {
  clientSecret: string | null;
  creatingIntent: boolean;
  confirming: boolean;
  intentError: string | null;
  retryLoadIntent: () => void;
  handlePaid: () => Promise<void>;
};

export const useBookingPaymentState = ({
  open,
  draft,
  onOpenChange,
  onFinished,
}: Params): Return => {
  const queryClient = useQueryClient();
  const createBookingIntent = useCreateBookingIntentMutation();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [bookingUuid, setBookingUuid] = useState<string | null>(null);
  const [creatingIntent, setCreatingIntent] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [intentError, setIntentError] = useState<string | null>(null);
  const creatingIntentRef = useRef(false);
  const openRef = useRef(open);
  const lastAttemptedDraftKeyRef = useRef<string | null>(null);

  const draftKey = draft
    ? `${draft.courtSlug}:${draft.organizerUsername}:${draft.sportSlug}:${draft.startTime}:${draft.endTime}`
    : null;

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    if (!open || !draft || !draftKey || clientSecret || creatingIntentRef.current) {
      return;
    }

    if (lastAttemptedDraftKeyRef.current === draftKey) {
      return;
    }

    const run = async () => {
      lastAttemptedDraftKeyRef.current = draftKey;
      creatingIntentRef.current = true;
      setCreatingIntent(true);
      setIntentError(null);

      try {
        const result = await Promise.race([
          createBookingIntent.mutateAsync({
            courtSlug: draft.courtSlug,
            organizerUsername: draft.organizerUsername,
            sportSlug: draft.sportSlug,
            startTime: draft.startTime,
            endTime: draft.endTime,
          }),
          new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error("Tiempo de espera agotado al crear el intent de pago")), 15000);
          }),
        ]);

        if (openRef.current) {
          setClientSecret(result.clientSecret);
          setBookingUuid(result.bookingUuid);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "No se pudo iniciar el pago";
        toast.error(message);
        if (openRef.current) {
          setIntentError(message);
        }
      } finally {
        creatingIntentRef.current = false;
        if (openRef.current) {
          setCreatingIntent(false);
        }
      }
    };

    run();
  }, [
    open,
    draft,
    draftKey,
    clientSecret,
    createBookingIntent,
  ]);

  useEffect(() => {
    if (!open) {
      setClientSecret(null);
      setBookingUuid(null);
      setCreatingIntent(false);
      creatingIntentRef.current = false;
      setConfirming(false);
      setIntentError(null);
      lastAttemptedDraftKeyRef.current = null;
    }
  }, [open]);

  useEffect(() => {
    if (!open || !creatingIntent) {
      return;
    }

    const timeoutId = setTimeout(() => {
      if (!creatingIntentRef.current) {
        return;
      }

      creatingIntentRef.current = false;
      setCreatingIntent(false);
      setIntentError("Tiempo de espera agotado al crear el intent de pago");
      toast.error("Tiempo de espera agotado al crear el intent de pago");
    }, 17000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [open, creatingIntent]);

  const retryLoadIntent = () => {
    setIntentError(null);
    setClientSecret(null);
    setBookingUuid(null);
    creatingIntentRef.current = false;
    lastAttemptedDraftKeyRef.current = null;
  };

  const handlePaid = async () => {
    if (!draft || !bookingUuid) {
      return;
    }

    setConfirming(true);
    toast.success("Pago aceptado. Confirmando estado final de la reserva...");

    try {
      // Cerrar modal en cuanto el pago se haya confirmado por Stripe
      onOpenChange(false);
      onFinished();

      const status = await pollBookingStatus(
        bookingUuid,
        draft.organizerUsername,
        draft.courtSlug,
      );

      await queryClient.invalidateQueries({ queryKey: ["booked-slots", draft.courtSlug] });
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });

      if (status === BookingStatus.SUCCESS || status === BookingStatus.CONFIRMED) {
        toast.success("Reserva confirmada. Ya podes ver tu turno.");
      } else if (status === BookingStatus.CANCELLED) {
        toast.error("El pago no termino correctamente. La reserva quedo cancelada.");
      } else {
        toast("Pago recibido. El estado final se esta actualizando.");
      }
    } finally {
      setConfirming(false);
    }
  };

  return {
    clientSecret,
    creatingIntent,
    confirming,
    intentError,
    retryLoadIntent,
    handlePaid,
  };
};
