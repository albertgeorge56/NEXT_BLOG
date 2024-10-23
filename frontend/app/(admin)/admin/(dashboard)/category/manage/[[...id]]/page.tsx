"use client";
import { Button, FileInput, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import Image from "next/image";
import { z } from "zod";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { apiBaseUrl } from "@/app/(admin)/utils/config";
import { getToken } from "@/app/(admin)/utils/action";
import { notifications } from "@mantine/notifications";
import dynamic from "next/dynamic";
import { ICategory } from "@/app/(admin)/utils/types";
import { useRouter } from "next/navigation";
import slugify from "slugify";

const TextEditor = dynamic(
  () => import("@/app/(admin)/components/TextEditor"),
  {
    ssr: false,
  }
);

const categorySchema = z.object({
  title: z.string().min(3, { message: "Title is required" }),
  slug: z.string().min(3, { message: "Slug is required" }),
  content: z.string().min(3, { message: "required" }),
  image: z
    .any()
    .optional()
    .refine((file) => {
      if (file) {
        if (!(file instanceof File)) {
          return false;
        }
        if (file.size > 1024 * 1024 * 10) {
          return false;
        }
        const validTypes = ["image/png", "image/jpg", "image/jpeg"];
        return validTypes.includes(file.type);
      }
      return true;
    }, "File size must be less than 10 MB Image"),
});

export default function Manage({ params }: { params: { id?: string[] } }) {
  const id = params?.id && params?.id[0];
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm({
    initialValues: {
      title: "",
      slug: "",
      content: "",
      image: null,
    },
    validate: zodResolver(categorySchema),
  });

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (id) {
        try {
          const token = await getToken();
          const response = await axios.get(`${apiBaseUrl}/categories/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const category: ICategory = response.data.category;
          form.setValues({
            title: category.title,
            slug: category.slug,
            content: category.content,
            image: null,
          });
          if (category.image) {
            setImagePreview(`${apiBaseUrl}/${category.image}`);
          }
        } catch (error) {
          notifications.show({
            message: "Failed to fetch category data",
            color: "red",
          });
        }
      }
    };
    fetchCategoryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (value: typeof form.values) => {
    const token = await getToken();
    const catFormData = new FormData();
    catFormData.append("title", value.title);
    catFormData.append("slug", value.slug);
    catFormData.append("content", value.content);
    if (value.image) {
      catFormData.append("image", value.image);
    }
    try {
      if (id) {
        await axios.post(`${apiBaseUrl}/categories/${id}`, catFormData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        notifications.show({ message: "Category Updated" });
        router.push(`/admin/category/manage/${id}`);
      } else {
        await axios.post(`${apiBaseUrl}/categories`, catFormData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        notifications.show({ message: "Category Added" });
        form.reset();
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: any) {
      if (err instanceof AxiosError) {
        notifications.show({
          message: err.response?.data.error,
          color: "red",
        });
        return;
      }
      notifications.show({
        message: `${id ? "Failed to Update Category" : "Failed to Add Category"}`,
        color: "red",
      });
    }
  };

  useEffect(() => {
    if (
      form.values.image != null &&
      (form.values.image as unknown) instanceof File
    ) {
      const objectUrl = URL.createObjectURL(form.values.image);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setImagePreview(null);
  }, [form.values.image]);

  useEffect(() => {
    if (form.values.title) {
      form.setFieldValue(
        "slug",
        slugify(form.values.title, { lower: true, strict: true })
      );
    } else {
      form.setFieldValue("slug", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.title]);

  return (
    <>
      <div className="w-full max-w-xl">
        <h1 className="text-xl mb-4 font-bold uppercase">Add Category</h1>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <div className="space-y-4">
            <TextInput
              withAsterisk
              label="Title"
              placeholder="Enter Title"
              key={form.key("title")}
              {...form.getInputProps("title")}
            />
            <TextInput
              withAsterisk
              label="Slug"
              placeholder="Enter Slug"
              key={form.key("slug")}
              {...form.getInputProps("slug")}
            />
            <TextEditor
              error={form.errors.content}
              content={form.values.content}
              onChange={(val) => form.setFieldValue("content", val)}
            />
            <FileInput
              clearable
              accept="image/png,image/jpeg"
              label="Upload files"
              placeholder="Upload files"
              {...form.getInputProps("image")}
            />
          </div>
          {imagePreview && (
            <div className="mt-4">
              <Image
                className="rounded-md"
                src={imagePreview}
                alt="Image"
                width={200}
                height={200}
              />
            </div>
          )}
          <div className="mt-6">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </>
  );
}
