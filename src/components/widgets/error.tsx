"use client";

import { ErrorDetail, ErrorObj } from "@/lib/validation/types";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ErrorToast({ error }: { error: ErrorObj }) {
  useEffect(() => {
    if (error && error.errors && Array.isArray(error.errors)) {
      const errorMessage = (
        <div className="">
          <p className="text-base">Error {error.statusCode}</p>
          <ul>
            {error.errors.map((err: ErrorDetail, index: number) => (
              <li key={index}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
      toast.error(errorMessage);
    } else {
      console.error(
        "Error object is invalid or does not contain errors array:",
        error
      );
    }
  }, [error]);

  return null;
}
