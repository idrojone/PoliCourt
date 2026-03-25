import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Court } from "@/features/types/court/Court";
import type { Sport } from "@/features/types/sport/Sport";
import { useBookedSlotsQuery } from "@/features/bookings/queries/useBookedSlotsQuery";
import { useSportsPageQuery } from "@/features/sport/queries/useSportsPageQuery.fa";
import type { BookingDraft, SlotRange, SlotView, SportOption } from "@/features/bookings/components/booking-flow/types";
import { buildDailySlots, toReadableSportName } from "@/features/bookings/components/booking-flow/utils";

type Params = {
  court: Court;
  selectionOpen: boolean;
  organizerUsername?: string;
  onRequireLogin: () => void;
};

type Return = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  selectedSportSlug: string;
  setSelectedSportSlug: (slug: string) => void;
  selectedSlotRange: SlotRange | null;
  toggleSlotSelection: (index: number) => void;
  effectiveSports: SportOption[];
  slots: SlotView[];
  draft: BookingDraft | null;
  setDraft: (draft: BookingDraft | null) => void;
  prepareDraftAndValidate: () => BookingDraft | null;
  resetSelection: () => void;
};

export const useBookingSelectionState = ({
  court,
  selectionOpen,
  organizerUsername,
  onRequireLogin,
}: Params): Return => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSportSlug, setSelectedSportSlug] = useState<string>("");
  const [selectedSlotRange, setSelectedSlotRange] = useState<SlotRange | null>(null);
  const [draft, setDraft] = useState<BookingDraft | null>(null);

  const { data: bookedSlots = [] } = useBookedSlotsQuery(court.slug, selectionOpen);
  const { data: publicSports = [] } = useSportsPageQuery({});

  const effectiveSports = useMemo<SportOption[]>(() => {
    const catalog = new Map<string, string>();

    publicSports.forEach((sport: Sport) => {
      if (sport.slug) {
        catalog.set(sport.slug, sport.name || toReadableSportName(sport.slug));
      }
    });

    const rawSports = (court.sports ?? []) as Array<string | Sport>;

    if (rawSports.length > 0) {
      const fromCourt = rawSports
        .map((sport) => {
          if (typeof sport === "string") {
            return {
              slug: sport,
              name: catalog.get(sport) ?? toReadableSportName(sport),
            };
          }

          const slug = sport.slug;
          if (!slug) {
            return null;
          }

          return {
            slug,
            name: sport.name || catalog.get(slug) || toReadableSportName(slug),
          };
        })
        .filter((item): item is SportOption => Boolean(item));

      if (fromCourt.length > 0) {
        return fromCourt;
      }
    }

    return publicSports
      .filter((sport: Sport) => Boolean(sport.slug))
      .map((sport: Sport) => ({
        slug: sport.slug,
        name: sport.name || toReadableSportName(sport.slug),
      }));
  }, [court.sports, publicSports]);

  const slots = useMemo(() => {
    return buildDailySlots(selectedDate, bookedSlots);
  }, [selectedDate, bookedSlots]);

  useEffect(() => {
    setSelectedSlotRange(null);
  }, [selectedDate]);

  const toggleSlotSelection = (index: number) => {
    const slot = slots[index];
    if (!slot || slot.isUnavailable) {
      return;
    }

    if (!selectedSlotRange) {
      setSelectedSlotRange({ start: index, end: index });
      return;
    }

    const { start, end } = selectedSlotRange;
    const isSelected = index >= start && index <= end;

    if (isSelected) {
      if (start === end) {
        setSelectedSlotRange(null);
        return;
      }

      if (index === start) {
        setSelectedSlotRange({ start: start + 1, end });
      } else if (index === end) {
        setSelectedSlotRange({ start, end: end - 1 });
      }

      return;
    }

    if (index === start - 1) {
      setSelectedSlotRange({ start: index, end });
      return;
    }

    if (index === end + 1) {
      setSelectedSlotRange({ start, end: index });
    }
  };

  const formatHour = (isoDate: string) => {
    return new Date(isoDate).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  useEffect(() => {
    if (effectiveSports.length === 0) {
      if (selectedSportSlug !== "") {
        setSelectedSportSlug("");
      }
      return;
    }

    const exists = effectiveSports.some((sport) => sport.slug === selectedSportSlug);
    if (!exists) {
      setSelectedSportSlug(effectiveSports[0].slug);
    }
  }, [effectiveSports, selectedSportSlug]);

  const prepareDraftAndValidate = () => {
    if (!organizerUsername) {
      toast.error("Tenes que iniciar sesion para reservar");
      onRequireLogin();
      return null;
    }

    if (!selectedSportSlug) {
      toast.error("Selecciona un deporte");
      return null;
    }

    if (!selectedSlotRange) {
      toast.error("Selecciona un horario");
      return null;
    }

    const { start, end } = selectedSlotRange;
    const firstSlot = slots[start];
    const lastSlot = slots[end];

    if (!firstSlot || !lastSlot) {
      toast.error("Selecciona un horario valido");
      return null;
    }

    const rangeHasUnavailable = slots.slice(start, end + 1).some((slot) => slot.isUnavailable);
    if (rangeHasUnavailable) {
      toast.error("Tu seleccion incluye horarios no disponibles");
      return null;
    }

    const timeLabel = start === end
      ? firstSlot.label
      : `${formatHour(firstSlot.startTime)} - ${formatHour(lastSlot.endTime)}`;

    const nextDraft: BookingDraft = {
      courtSlug: court.slug,
      organizerUsername,
      sportSlug: selectedSportSlug,
      startTime: firstSlot.startTime,
      endTime: lastSlot.endTime,
      dateLabel: selectedDate.toLocaleDateString("es-ES", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      timeLabel,
    };

    setDraft(nextDraft);
    return nextDraft;
  };

  const resetSelection = () => {
    setSelectedSlotRange(null);
    setDraft(null);
  };

  return {
    selectedDate,
    setSelectedDate,
    selectedSportSlug,
    setSelectedSportSlug,
    selectedSlotRange,
    toggleSlotSelection,
    effectiveSports,
    slots,
    draft,
    setDraft,
    prepareDraftAndValidate,
    resetSelection,
  };
};
