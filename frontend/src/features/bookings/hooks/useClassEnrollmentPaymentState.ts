import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCreateClassEnrollmentIntentMutation } from "@/features/bookings/mutations/useCreateClassEnrollmentIntentMutation";
import type { ClassEnrollmentRequest } from "@/features/types/bookings/ClassEnrollmentRequest";

type Params = {
  open: boolean;
  bookingUuid: string | null;
  onOpenChange: (open: boolean) => void;
  onFinished: () => void;
};

export const useClassEnrollmentPaymentState = ({
  open,
  bookingUuid,
  onOpenChange,
  onFinished,
}: Params) => {
  const queryClient = useQueryClient();
  const createClassEnrollmentIntent = useCreateClassEnrollmentIntentMutation();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [creatingIntent, setCreatingIntent] = useState(false);
  const [intentError, setIntentError] = useState<string | null>(null);
  const creatingIntentRef = useRef(false);
  const bookingKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!open || !bookingUuid || clientSecret || creatingIntentRef.current) {
      return;
    }

    if (bookingKeyRef.current === bookingUuid) {
      return;
    }

    const loadIntent = async () => {
      creatingIntentRef.current = true;
      setCreatingIntent(true);
      setIntentError(null);
      bookingKeyRef.current = bookingUuid;

      try {
        const result = await createClassEnrollmentIntent.mutateAsync({ bookingUuid });
        if (open) {
          setClientSecret(result.clientSecret);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "No se pudo iniciar el pago";
        toast.error(message);
        if (open) {
          setIntentError(message);
        }
      } finally {
        creatingIntentRef.current = false;
        if (open) {
          setCreatingIntent(false);
        }
      }
    };

    loadIntent();
  }, [open, bookingUuid, clientSecret, createClassEnrollmentIntent]);

  useEffect(() => {
    if (!open) {
      setClientSecret(null);
      setCreatingIntent(false);
      creatingIntentRef.current = false;
      setIntentError(null);
      bookingKeyRef.current = null;
    }
  }, [open]);

  const retryLoadIntent = () => {
    setIntentError(null);
    setClientSecret(null);
    creatingIntentRef.current = false;
    bookingKeyRef.current = null;
  };

  const handlePaid = async () => {
    if (!bookingUuid) {
      return;
    }

    toast.success("Pago recibido. La inscripción se está procesando.");
    onOpenChange(false);
    onFinished();
    queryClient.invalidateQueries({ queryKey: ["classes"] });
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
  };

  return {
    clientSecret,
    creatingIntent,
    intentError,
    retryLoadIntent,
    handlePaid,
  };
};
