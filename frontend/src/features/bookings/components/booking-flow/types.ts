import type { Court } from "@/features/types/court/Court";

export type SlotView = {
  label: string;
  startTime: string;
  endTime: string;
  isUnavailable: boolean;
};

export type BookingDraft = {
  courtSlug: string;
  organizerUsername: string;
  sportSlug: string;
  startTime: string;
  endTime: string;
  dateLabel: string;
  timeLabel: string;
};

export type SportOption = {
  slug: string;
  name: string;
};

export type BookingFlowDialogProps = {
  court: Court;
  triggerLabel?: string;
  triggerVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  triggerClassName?: string;
};
