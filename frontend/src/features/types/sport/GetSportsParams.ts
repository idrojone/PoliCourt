export interface GetSportsParams {
  q?: string;
  // Ahora puede ser un arreglo (multiple checkbox)
  status?: string[];
  isActive?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}