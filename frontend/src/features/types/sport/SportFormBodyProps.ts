import type { CreateSportDTO } from "./CreateSportDTO";
import type { Sport } from "./Sport";

export interface SportFormBodyProps {
  sportToEdit: Sport | null;
  onSave: (data: CreateSportDTO) => void;
  isSaving: boolean;
  onCancel: () => void;
}
