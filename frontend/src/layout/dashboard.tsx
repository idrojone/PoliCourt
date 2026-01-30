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
    <div className="flex flex-col h-full mr-5 overflow-hidden">
      {/* Header fijo */}
      <div className="shrink-0 flex justify-between items-center py-4 border-b bg-background">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-4">
          {extraActions}
          {actionLabel && onAction && (
            <Button onClick={onAction}>{actionLabel}</Button>
          )}
        </div>
      </div>

      {/* Contenido con scroll */}
      <div className="flex-1 overflow-y-auto py-6">{children}</div>

      {footer && (
        <div className="shrink-0 bg-background pt-4 pb-4 border-t">
          {footer}
        </div>
      )}
    </div>
  );
};
