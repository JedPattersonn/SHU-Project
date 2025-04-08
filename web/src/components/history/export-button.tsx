"use client";

import { ExportDataDialog } from "@/components/history/export-data-dialog";
import { exportEnergyData } from "@/lib/actions/export-data";

type ExportButtonProps = {
  userRole: "city" | "network";
  entityId: string;
};

export function ExportButton({ userRole, entityId }: ExportButtonProps) {
  const handleExport = async (data: {
    year: string;
    type: "gas" | "electricity";
    userRole: "city" | "network";
    entityId: string;
  }) => {
    const result = await exportEnergyData(data);
    if (result.error) {
      alert(result.error);
      return;
    }

    if (!result.csvContent) {
      alert("No data available to export");
      return;
    }

    const blob = new Blob([result.csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `energy-data-${data.year === "all" ? "all-years" : data.year}-${data.type}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ExportDataDialog
      onExport={handleExport}
      userRole={userRole}
      entityId={entityId}
    />
  );
}
