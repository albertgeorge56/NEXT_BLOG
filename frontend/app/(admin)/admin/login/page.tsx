"use client";
import { Button, PasswordInput, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { IconLock, IconMail } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter } from "next/navigation";
import { login } from "../../utils/action";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(2, {
    message: "Invalid password",
  }),
});

const ThemeSwitcher = dynamic(() => import("../../components/ThemeSwitcher"), {
  ssr: false,
});

export default function Login() {
  const router = useRouter();
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(loginSchema),
  });

  const handleSubmit = async (value: typeof form.values) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        value
      );
      await login(res.data.token);
      notifications.show({
        title: "Login Successful",
        message: "You are logged in.",
        autoClose: 3000,
      });
      router.push("/admin");
      return;
    } catch (err: any) {
      if (err.response?.data?.error) {
        notifications.show({
          title: "Login Failed",
          message: err.response?.data?.error,
          autoClose: 3000,
          color: "red",
        });
      }
    }
  };

  return (
    <>
      <div className="relative min-h-screen w-screen flex flex-col justify-center items-center">
        <div className="absolute right-2 top-2">
          <ThemeSwitcher />
        </div>
        <div className="w-full max-w-xl bg-zinc-50 border border-zinc-200 dark:border-zinc-600 dark:bg-zinc-700 p-10 rounded-xl shadow-md">
          <h1 className="text-xl text-center mb-4 font-bold uppercase">
            NEXT BLOG
          </h1>
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <div className="space-y-4">
              <TextInput
                withAsterisk
                leftSectionPointerEvents="none"
                leftSection={<IconMail size={20} strokeWidth={1.5} />}
                label="Email"
                placeholder="Enter Email"
                key={form.key("email")}
                {...form.getInputProps("email")}
              />
              <PasswordInput
                withAsterisk
                label="Password"
                leftSectionPointerEvents="none"
                leftSection={<IconLock size={20} strokeWidth={1.5} />}
                placeholder="Enter Password"
                key={form.key("password")}
                {...form.getInputProps("password")}
              />
            </div>
            <div className="mt-6 flex justify-between items-center">
              <Button type="submit">Submit</Button>
              <Button
                variant="default"
                type="button"
                onClick={async () => {
                  await handleSubmit({
                    email: "georgeynr@gmail.com",
                    password: "abc123",
                  });
                }}
              >
                Demo Account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
