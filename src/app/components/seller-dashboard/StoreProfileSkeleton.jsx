import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const StoreProfileSkeleton = () => {
  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      <Separator className="mb-6" />

      {/* Basic Info Section */}
      <div className="mb-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="md:col-span-2">
            <Skeleton className="h-4 w-36 mb-2" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>

      {/* Business Details Section */}
      <div className="mb-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array(4)
            .fill()
            .map((_, i) => (
              <div key={`business-${i}`}>
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
        </div>
      </div>

      {/* Contact Details Section */}
      <div className="mb-6">
        <Skeleton className="h-6 w-44 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array(4)
            .fill()
            .map((_, i) => (
              <div key={`contact-${i}`}>
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StoreProfileSkeleton;
