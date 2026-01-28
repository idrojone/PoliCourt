import type { GeneralStatusType } from "@/types";
import type { Court } from "./Court";

export interface CourtCardAdminProps {
  court: Court;
  isOverlay?: boolean;
  toggleMutationPending: boolean;
  openEdit: (court: Court) => void;
  toggleActive: (court: Court) => void;
  handleStatusChange: (slug: string, status: GeneralStatusType) => void;
}
