import type { GeneralStatusType } from "@/types";

export const getStatusColor = (status: GeneralStatusType) => {
  switch (status) {
    case "PUBLISHED":
      return "text-green-600 border-green-200 bg-green-50";
    case "DRAFT":
      return "text-yellow-600 border-yellow-200 bg-yellow-50";
    case "ARCHIVED":
      return "text-gray-600 border-gray-200 bg-gray-50";
    case "SUSPENDED":
      return "text-red-600 border-red-200 bg-red-50";
    default:
      return "text-gray-500 border-gray-200";
  }
};
