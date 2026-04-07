import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EditClassForm from "./EditClassForm";
import type { BookingResponse } from "@/features/types/bookings/BookingRecord";

type Props = {
  classItem: BookingResponse;
};

export const EditClassDialog: React.FC<Props> = ({ classItem }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Editar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar clase</DialogTitle>
        </DialogHeader>
        <EditClassForm initial={classItem} onSuccess={() => { /* optionally close dialog via state lift */ }} />
      </DialogContent>
    </Dialog>
  );
};

export default EditClassDialog;
