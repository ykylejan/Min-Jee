"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="min-h-screen bg-[#FFFBF5] px-4 sm:px-8 md:px-12 lg:px-24 pt-24 sm:pt-32 lg:pt-44">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-x-12 justify-center items-center lg:items-start">
        {/* Image skeleton */}
        <div className="w-full lg:w-auto flex justify-center">
          <Skeleton className="aspect-square w-full max-w-[350px] sm:max-w-[400px] lg:max-w-none lg:h-[500px] lg:w-[500px] rounded-md bg-camouflage-100" />
        </div>

        {/* Content skeleton */}
        <div className="w-full lg:w-1/2 px-0 sm:px-4 lg:px-10">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded bg-camouflage-100" />
            <Skeleton className="h-4 w-4 bg-camouflage-100" />
            <Skeleton className="h-4 w-12 bg-camouflage-100" />
            <Skeleton className="h-4 w-4 bg-camouflage-100" />
            <Skeleton className="h-4 w-24 bg-camouflage-100" />
          </div>

          {/* Title and price skeleton */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex-1">
              <Skeleton className="h-10 sm:h-12 lg:h-14 w-3/4 bg-camouflage-100" />
              <Skeleton className="h-6 sm:h-7 lg:h-8 w-32 mt-2 bg-camouflage-100" />
            </div>
            <Skeleton className="h-6 w-6 bg-camouflage-100" />
          </div>

          {/* Service Item select skeleton */}
          <div className="mt-8 sm:mt-12 lg:mt-16">
            <Skeleton className="h-5 w-24 mb-2 bg-camouflage-100" />
            <Skeleton className="h-12 w-full sm:w-80 rounded bg-camouflage-100" />
          </div>

          {/* Button skeleton */}
          <Skeleton className="h-12 w-full rounded-3xl mt-5 bg-camouflage-100" />

          {/* Description skeleton */}
          <div className="mt-8 sm:mt-12 lg:mt-16">
            <Skeleton className="h-5 w-24 mb-2 bg-camouflage-100" />
            <Skeleton className="h-4 w-full bg-camouflage-100" />
            <Skeleton className="h-4 w-full mt-1 bg-camouflage-100" />
            <Skeleton className="h-4 w-2/3 mt-1 bg-camouflage-100" />
          </div>

          {/* Categories skeleton */}
          <div className="mt-8 sm:mt-12 lg:mt-16">
            <Skeleton className="h-5 w-20 mb-2 bg-camouflage-100" />
            <Skeleton className="h-6 w-16 rounded-full bg-camouflage-100" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
