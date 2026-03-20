import { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Props = {
  clientSecret: string;
  onPaid: () => Promise<void>;
  disabled: boolean;
};

export const StripePaymentForm: React.FC<Props> = ({ clientSecret, onPaid, disabled }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements || submitting || disabled) {
      return;
    }

    setSubmitting(true);

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        toast.error("No se pudo cargar el campo de tarjeta");
        return;
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      console.log("Stripe payment result:", result);

      if (result.error) {
        toast.error(result.error.message ?? "No se pudo confirmar el pago");
        console.error("Stripe payment error:", result.error);
        return;
      }

      await onPaid();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="rounded-md border bg-background px-3 py-3">
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                color: "#ffffff",
                fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
                fontSize: "16px",
                lineHeight: "24px",
              },
              invalid: {
                color: "#ef4444",
              },
            },
          }}
        />
      </div>
      <Button
        className="w-full"
        disabled={!stripe || submitting || disabled}
        type="submit">
        {submitting ? "Confirmando pago..." : "Pagar y confirmar reserva"}
      </Button>
    </form>
  );
};
