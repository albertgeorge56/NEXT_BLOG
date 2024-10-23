"use server";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { apiBaseUrl } from "./config";

export const login = (token: string) => {
  cookies().set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV == "production",
    path: "/",
  });
};

export const getToken = async () => {
  return cookies().get("token")?.value;
};

export const logout = () => {
  cookies().set("token", "", { maxAge: 0 });
};
