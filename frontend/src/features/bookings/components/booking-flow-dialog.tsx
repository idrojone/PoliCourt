import { useState } from "react";
import type { ComponentProps } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/context/AuthContext";
import type { Court } from "@/features/types/court/Court";
import { BookingPaymentDialog } from "@/features/bookings/components/booking-flow/BookingPaymentDialog";
import { BookingSelectionDialog } from "@/features/bookings/components/booking-flow/BookingSelectionDialog";
import { useBookingSelectionState } from "@/features/bookings/hooks/useBookingSelectionState";

type BookingFlowDialogProps = {
  court: Court;
  triggerLabel?: string;
  triggerVariant?: ComponentProps<typeof Button>["variant"];
  triggerClassName?: string;
};

export const BookingFlowDialog: React.FC<BookingFlowDialogProps> = ({
  court,
  triggerLabel = "Reservar",
  triggerVariant = "default",
  triggerClassName,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [selectionOpen, setSelectionOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const {
    selectedDate,
    setSelectedDate,
    selectedSportSlug,
    setSelectedSportSlug,
    selectedSlotRange,
    toggleSlotSelection,
    effectiveSports,
    slots,
    draft,
    prepareDraftAndValidate,
    resetSelection,
  } = useBookingSelectionState({
    court,
    selectionOpen,
    organizerUsername: user?.username,
    onRequireLogin: () => {
      navigate("/login", { state: { from: location } });
    },
  });

  const handleContinueToPayment = () => {
    const nextDraft = prepareDraftAndValidate();
    if (!nextDraft) {
      return;
    }

    setSelectionOpen(false);
    setPaymentOpen(true);
  };

  return (
    <>
      <Button className={triggerClassName} onClick={() => setSelectionOpen(true)} variant={triggerVariant}>
        {triggerLabel}
      </Button>

      <BookingSelectionDialog
        open={selectionOpen}
        onOpenChange={setSelectionOpen}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        selectedSportSlug={selectedSportSlug}
        onSportChange={setSelectedSportSlug}
        selectedSlotRange={selectedSlotRange}
        onSlotToggle={toggleSlotSelection}
        sports={effectiveSports}
        slots={slots}
        court={court}
        onContinue={handleContinueToPayment}
      />

      <BookingPaymentDialog
        draft={draft}
        onFinished={resetSelection}
        onOpenChange={setPaymentOpen}
        open={paymentOpen}
      />
    </>
  );
};
