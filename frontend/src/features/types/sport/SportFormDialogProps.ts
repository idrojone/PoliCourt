import type { CreateSportDTO } from "./CreateSportDTO";
import type { Sport } from "./Sport";

export interface SportFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sportToEdit: Sport;
  onSave: (data: CreateSportDTO) => Promise<void>;
  isSaving: boolean;
}
