import { api } from "@/lib/axios.sb";
import type {
  Booking,
  BookingStatus,
  CreateBookingDTO,
  CreateRentalDTO,
  UpdateBookingDTO,
  UpdateRentalDTO,
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

export const getBookingBySlug = async (slug: string): Promise<Booking> => {
  return await api.get(`/bookings/${slug}`).then((res) => res.data.data);
};

// ========================
// POST endpoints por tipo
// ========================

/**
 * Crea un RENTAL - solo necesita courtSlug, organizerUsername, startTime, endTime.
 * El backend genera el título automáticamente y calcula el precio.
 */
export const createRental = async (
  payload: CreateRentalDTO
): Promise<Booking> => {
  return await api.post("/bookings/rentals", payload).then((res) => res.data.data);
};

/**
 * Crea una CLASS - necesita todos los campos del CreateBookingDTO.
 * El organizador debe ser un MONITOR.
 */
export const createClass = async (
  payload: CreateBookingDTO
): Promise<Booking> => {
  return await api.post("/bookings/classes", payload).then((res) => res.data.data);
};

/**
 * Crea un TRAINING - necesita todos los campos del CreateBookingDTO.
 * El organizador debe ser un COACH.
 */
export const createTraining = async (
  payload: CreateBookingDTO
): Promise<Booking> => {
  return await api.post("/bookings/trainings", payload).then((res) => res.data.data);
};

// ========================
// PUT endpoints (actualización)
// ========================

/**
 * Actualiza un RENTAL - solo se pueden modificar startTime y endTime.
 * El precio se recalcula automáticamente.
 * NO se puede cambiar la pista ni el usuario.
 */
export const updateRental = async (
  slug: string,
  payload: UpdateRentalDTO
): Promise<Booking> => {
  return await api
    .put(`/bookings/rentals/${slug}`, payload)
    .then((res) => res.data.data);
};

/**
 * Actualiza una CLASS - se puede modificar título, descripción y horas.
 * Si cambia el título, se regenera el slug.
 * NO se puede cambiar la pista ni el usuario.
 */
export const updateClass = async (
  slug: string,
  payload: UpdateBookingDTO
): Promise<Booking> => {
  return await api
    .put(`/bookings/classes/${slug}`, payload)
    .then((res) => res.data.data);
};

/**
 * Actualiza un TRAINING - se puede modificar título, descripción y horas.
 * Si cambia el título, se regenera el slug.
 * NO se puede cambiar la pista ni el usuario.
 */
export const updateTraining = async (
  slug: string,
  payload: UpdateBookingDTO
): Promise<Booking> => {
  return await api
    .put(`/bookings/trainings/${slug}`, payload)
    .then((res) => res.data.data);
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
