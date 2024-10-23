"use client";
import {
  Button,
  FileInput,
  MultiSelect,
  Skeleton,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import Image from "next/image";
import slugify from "slugify";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";
import dynamic from "next/dynamic";
import { useFetcher } from "@/app/(admin)/utils/helpers";
import { ICategoryResponse, IPost } from "@/app/(admin)/utils/types";
import { postSchema } from "@/app/(admin)/utils/schema";
import { useRouter } from "next/navigation";
import { getToken } from "@/app/(admin)/utils/action";
import { apiBaseUrl } from "@/app/(admin)/utils/config";
import axios, { AxiosError } from "axios";

const TextEditor = dynamic(
  () => import("@/app/(admin)/components/TextEditor"),
  {
    loading: () => <Skeleton height={300} radius="md" />,
    ssr: false,
  }
);

export default function Manage({ params }: { params: { id?: string[] } }) {
  const id = params?.id && params?.id[0];
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { data } = useFetcher<ICategoryResponse>(`categories`);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const categoryData: { label: string; value: string }[] = data?.categories
    ? data!.categories.map((cat) => ({
        label: cat.title!,
        value: cat.id!.toString(),
      }))
    : [{ label: "", value: "" }];

  const form = useForm({
    initialValues: {
      title: "",
      slug: "",
      content: "",
      categoryIds: [],
      image: null,
    },
    validate: zodResolver(postSchema),
  });

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

  useEffect(() => {
    const fetchPostData = async () => {
      if (id) {
        try {
          const token = await getToken();
          const response = await axios.get(`${apiBaseUrl}/posts/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const post: IPost = response.data.post;
          form.setValues({
            title: post.title,
            slug: post.slug,
            categoryIds:
              (post.categories?.map((c) => c.id?.toString()) as any) || [],
            content: post.content,
            image: null,
          });
          if (post.image) {
            setImagePreview(`${apiBaseUrl}/${post.image}`);
          }
        } catch (error) {
          notifications.show({
            message: "Failed to fetch post data",
            color: "red",
          });
        }
      }
    };
    fetchPostData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (value: typeof form.values) => {
    const token = await getToken();
    const postFormData = new FormData();
    postFormData.append("title", value.title);
    postFormData.append("slug", value.slug);
    postFormData.append("content", value.content);
    postFormData.append("categoryIds", JSON.stringify(value.categoryIds));
    if (value.image) {
      postFormData.append("image", value.image);
    }
    setLoading(true);
    try {
      if (id) {
        await axios.post(`${apiBaseUrl}/posts/${id}`, postFormData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        notifications.show({ message: "Post Updated" });
        router.push(`/admin/post/manage/${id}`);
      } else {
        await axios.post(`${apiBaseUrl}/posts`, postFormData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        notifications.show({ message: "Post Added" });
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
        message: `${id ? "Failed to Update Post" : "Failed to Add Post"}`,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      form.values.image != null &&
      (form.values.image as any) instanceof File
    ) {
      const objectUrl = URL.createObjectURL(form.values.image);
      setImagePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setImagePreview(null);
  }, [form.values.image]);

  return (
    <>
      <div className="w-full max-w-xl">
        <h1 className="text-xl mb-4 font-bold uppercase">Add Post</h1>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <div className="space-y-4">
            <TextInput
              withAsterisk
              label="Title"
              placeholder="Enter Title"
              key={form.key("title")}
              {...form.getInputProps("title")}
            />
            <MultiSelect
              label="Category"
              placeholder="Choose"
              data={categoryData as any}
              searchable
              value={form.values.categoryIds}
              onChange={(val: any) => {
                form.setFieldValue("categoryIds", val);
              }}
              error={form.errors.categoryIds}
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
            <Button loading={loading} disabled={loading} type="submit">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
