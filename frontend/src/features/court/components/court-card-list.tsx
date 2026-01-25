import type { Court } from "@/features/types/court/Court";
import { CourtCardAdmin } from "./court-card-admin";
import type { GeneralStatusType } from "@/types";

interface CourtCardListProps {
  courts: Court[];
  isPending: boolean;
  openEdit: (court: Court) => void;
  toggleActive: (court: Court) => void;
  handleStatusChange: (slug: string, status: GeneralStatusType) => void;
}

export const CourtCardList: React.FC<CourtCardListProps> = ({
  courts,
  isPending,
  openEdit,
  toggleActive,
  handleStatusChange,
}) => {
  if (!courts || courts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No se encontraron pistas.</p>
        <p className="text-sm text-muted-foreground">
          Crea una nueva pista para comenzar.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {courts.map((court) => (
        <CourtCardAdmin
          key={court.slug}
          court={court}
          toggleMutationPending={isPending}
          openEdit={openEdit}
          toggleActive={toggleActive}
          handleStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );
};
