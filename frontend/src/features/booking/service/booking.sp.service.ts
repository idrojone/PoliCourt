import { api } from "@/lib/axios.sb";
import type {
  Booking,
  BookingStatus,
  BookingType,
  CreateBookingDTO,
} from "@/features/types/booking";

// ========================
// GET endpoints por tipo
// ========================

export const getRentals = async (): Promise<Booking[]> => {
  return await api.get("/bookings/rentals").then((res) => res.data.data);
};

export const getClasses = async (): Promise<Booking[]> => {
  return await api.get("/bookings/classes").then((res) => res.data.data);
};

export const getTrainings = async (): Promise<Booking[]> => {
  return await api.get("/bookings/trainings").then((res) => res.data.data);
};

export const getTournaments = async (): Promise<Booking[]> => {
  return await api.get("/bookings/tournaments").then((res) => res.data.data);
};

export const getBookingBySlug = async (slug: string): Promise<Booking> => {
  return await api.get(`/bookings/${slug}`).then((res) => res.data.data);
};

// ========================
// POST endpoints por tipo
// ========================

export const createRental = async (
  payload: CreateBookingDTO
): Promise<Booking> => {
  return await api.post("/bookings/rentals", payload).then((res) => res.data.data);
};

export const createClass = async (
  payload: CreateBookingDTO
): Promise<Booking> => {
  return await api.post("/bookings/classes", payload).then((res) => res.data.data);
};

export const createTraining = async (
  payload: CreateBookingDTO
): Promise<Booking> => {
  return await api.post("/bookings/trainings", payload).then((res) => res.data.data);
};

export const createTournament = async (
  payload: CreateBookingDTO
): Promise<Booking> => {
  return await api.post("/bookings/tournaments", payload).then((res) => res.data.data);
};

// Genérico para crear según tipo
export const createBooking = async (
  payload: CreateBookingDTO
): Promise<Booking> => {
  const typeEndpoints: Record<BookingType, string> = {
    RENTAL: "/bookings/rentals",
    CLASS: "/bookings/classes",
    TRAINING: "/bookings/trainings",
    TOURNAMENT: "/bookings/tournaments",
  };

  const endpoint = typeEndpoints[payload.type];
  return await api.post(endpoint, payload).then((res) => res.data.data);
};

// ========================
// PATCH endpoints
// ========================

export const updateBookingStatus = async (
  slug: string,
  status: BookingStatus
): Promise<Booking> => {
  return await api
    .patch(`/bookings/${slug}/status`, { status })
    .then((res) => res.data.data);
};

export const updateBookingActive = async (
  slug: string,
  isActive: boolean
): Promise<Booking> => {
  return await api
    .patch(`/bookings/${slug}/active`, { isActive })
    .then((res) => res.data.data);
};

export const toggleBookingActive = async (slug: string): Promise<Booking> => {
  return await api
    .patch(`/bookings/${slug}/toggle-active`)
    .then((res) => res.data.data);
};
