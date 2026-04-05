import React from "react";
import { JobStatus } from "../types";

interface StatusChipProps {
  status: JobStatus | "verified" | "unverified" | "pending" | "active" | "paused" | "idle" | "online" | "offline";
}

export const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case "running":
      case "active":
      case "online":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "done":
      case "verified":
        return "bg-green-50 text-green-700 border-green-100";
      case "failed":
      case "offline":
        return "bg-red-50 text-red-700 border-red-100";
      case "pending":
      case "idle":
        return "bg-gray-50 text-gray-700 border-gray-100";
      case "paused":
        return "bg-yellow-50 text-yellow-700 border-yellow-100";
      default:
        return "bg-gray-50 text-gray-700 border-gray-100";
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStyles()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
