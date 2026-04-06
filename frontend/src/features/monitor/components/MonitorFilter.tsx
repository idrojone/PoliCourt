import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Props = {
  value: "all" | "pending" | "approved" | "rejected";
  onChange: (v: "all" | "pending" | "approved" | "rejected") => void;
};

export const MonitorFilter: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="text-sm font-medium">Filtrar por estado:</span>
      <Select value={value} onValueChange={(v) => onChange(v as any)}>
        <SelectTrigger size="sm" className="w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="pending">pending</SelectItem>
          <SelectItem value="approved">approved</SelectItem>
          <SelectItem value="rejected">rejected</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default MonitorFilter;
