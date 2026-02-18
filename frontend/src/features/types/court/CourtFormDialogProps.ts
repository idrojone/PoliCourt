import type { CreateCourtDTO } from "./CreateCourtDTO";
import type { Court } from "./Court";

export interface CourtFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courtToEdit: Court | null;
    onSave: (data: CreateCourtDTO) => void;
    isSaving: boolean;
}
