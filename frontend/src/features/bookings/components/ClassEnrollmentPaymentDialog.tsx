import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useClassEnrollmentPaymentState } from "@/features/bookings/hooks/useClassEnrollmentPaymentState";
import { StripePaymentForm } from "@/features/bookings/components/booking-flow/StripePaymentForm";

const stripePublicKey =
  import.meta.env.VITE_STRIPE_PUBLIC_KEY ?? import.meta.env.VITE_STRIPE_KEY ?? "";

const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null;

type Props = {
  open: boolean;
  bookingUuid: string | null;
  onOpenChange: (open: boolean) => void;
  onFinished: () => void;
};

export const ClassEnrollmentPaymentDialog: React.FC<Props> = ({
  open,
  bookingUuid,
  onOpenChange,
  onFinished,
}) => {
  const { clientSecret, creatingIntent, intentError, retryLoadIntent, handlePaid } =
    useClassEnrollmentPaymentState({
      open,
      bookingUuid,
      onOpenChange,
      onFinished,
    });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Inscribirme a la clase</DialogTitle>
          <DialogDescription>
            Completa los datos de la tarjeta para confirmar tu inscripción.
          </DialogDescription>
        </DialogHeader>

        {!stripePromise ? (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            Falta la clave pública de Stripe. Configura VITE_STRIPE_PUBLIC_KEY o VITE_STRIPE_KEY.
          </div>
        ) : null}

        {creatingIntent ? <p className="text-sm text-muted-foreground">Preparando formulario de pago...</p> : null}

        {intentError ? (
          <div className="space-y-3 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm">
            <p className="text-destructive">No se pudo cargar el formulario de tarjeta.</p>
            <p className="text-muted-foreground">Detalle: {intentError}</p>
            <Button onClick={retryLoadIntent} type="button" variant="secondary">
              Reintentar
            </Button>
          </div>
        ) : null}

        {stripePromise && clientSecret ? (
          <Elements options={{ clientSecret }} stripe={stripePromise}>
            <StripePaymentForm clientSecret={clientSecret} disabled={creatingIntent} onPaid={handlePaid} />
          </Elements>
        ) : null}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} type="button" variant="outline">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
