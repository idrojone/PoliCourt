import type { BookingStatusType } from "@/features/types/bookings/BookingRecord";
import { searchBookings } from "@/features/bookings/services/booking.sp.service";
import type { SlotView } from "./types";

const pad = (value: number) => String(value).padStart(2, "0");

const overlaps = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) => {
  return aStart < bEnd && bStart < aEnd;
};

const isSameCalendarDay = (left: Date, right: Date) => {
  return left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate();
};

export const toReadableSportName = (slug: string) => {
  if (!slug) {
    return "Deporte";
  }

  const normalized = slug.replace(/[-_]+/g, " ").trim();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

export const buildDailySlots = (
  date: Date,
  bookedSlots: Array<{ startTime: string; endTime: string }>,
): SlotView[] => {
  const slots: SlotView[] = [];
  const now = new Date();
  const isToday = isSameCalendarDay(date, now);

  for (let hour = 9; hour < 21; hour += 1) {
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, 0, 0, 0);
    const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour + 1, 0, 0, 0);

    const unavailable = bookedSlots.some((booked) => {
      const bookedStart = new Date(booked.startTime);
      const bookedEnd = new Date(booked.endTime);
      return overlaps(start, end, bookedStart, bookedEnd);
    });

    const isPast = isToday && start.getTime() <= now.getTime();

    slots.push({
      label: `${pad(hour)}:00 - ${pad(hour + 1)}:00`,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      isUnavailable: unavailable || isPast,
    });
  }

  return slots;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollBookingStatus = async (
  bookingUuid: string,
  organizerUsername: string,
  courtSlug: string,
): Promise<BookingStatusType | null> => {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const page = await searchBookings({
      organizerUsername,
      courtSlug,
      page: 1,
      limit: 20,
      sort: "createdAt_desc",
      isActive: true,
    });

    const booking = page.content.find((item) => item.uuid === bookingUuid);

    if (booking?.status) {
      return booking.status;
    }

    await sleep(1500);
  }

  return null;
};
