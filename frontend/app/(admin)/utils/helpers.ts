import axios from "axios";
import { getToken } from "@/app/(admin)/utils/action";
import { useState } from "react";
import useSWR, { mutate, SWRResponse } from "swr";
import { apiBaseUrl } from "./config";

export const fetcher = async <T>(url: string): Promise<T> => {
  return axios
    .get(`${apiBaseUrl}/${url}`, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    })
    .then((res) => res.data);
};

export const postFetcher = async (
  url: string,
  data: any,
  mutateUrl: string | null,
  cb: (err: any, data: any) => void
) => {
  return axios
    .post(`${apiBaseUrl}/${url}`, data, {
      headers: { Authorization: `Bearer ${await getToken()}` },
    })
    .then((res) => {
      if (mutateUrl) mutate(mutateUrl);
      cb(null, res.data);
    })
    .catch((err) => cb(err, null));
};

export const useFetcher = <T>(url: string): SWRResponse<T> => {
  return useSWR<T>(url, fetcher);
};
