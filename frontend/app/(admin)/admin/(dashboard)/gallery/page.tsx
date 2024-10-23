"use client";

import { apiBaseUrl } from "@/app/(admin)/utils/config";
import { useFetcher } from "@/app/(admin)/utils/helpers";
import {
  ICategoryResponse,
  IGallery,
  IGalleryResponse,
} from "@/app/(admin)/utils/types";
import { Skeleton } from "@mantine/core";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Gallery() {
  const { data, isLoading, error } = useFetcher<IGalleryResponse>("gallery");
  return (
    <>
      <h2>View Gallery</h2>
      <div className="grid grid-cols-4 gap-2">
        {isLoading ? (
          <>
            {Array.from({ length: 5 }).map((el, idx: number) => (
              <Skeleton key={idx} height={200} radius="md" />
            ))}
          </>
        ) : (
          data?.gallery.map((img: IGallery, idx) => (
            <div
              key={idx}
              className="relative w-full h-[200px] overflow-hidden rounded-lg"
            >
              <Image
                layout="fill"
                className="absolute object-cover"
                src={`${apiBaseUrl}/${img.path}`}
                alt=""
              />
            </div>
          ))
        )}
      </div>
    </>
  );
}
