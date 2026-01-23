import React from "react";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  extraActions?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  title,
  actionLabel,
  onAction,
  children,
  footer,
  extraActions,
}) => {
  return (
    <div className="space-y-6 mt-3 mr-5 h-full flex flex-col">
      <div className="flex justify-between items-center pb-4 border-b">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-4">
          {extraActions}
          {actionLabel && onAction && (
            <Button onClick={onAction}>{actionLabel}</Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">{children}</div>

      {footer && (
        <div className="sticky bottom-0 bg-background pt-4 pb-4 border-t z-10">
          {footer}
        </div>
      )}
    </div>
  );
};
