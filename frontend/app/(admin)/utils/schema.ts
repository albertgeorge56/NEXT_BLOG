import { z } from "zod";
export const postSchema = z.object({
  title: z.string().min(3, { message: "Title is required" }),
  slug: z.string().min(3, { message: "Slug is required" }),
  content: z.string().min(3, { message: "Content is Required" }),
  categoryIds: z
    .array(z.string())
    .nonempty({ message: "Category is required" }),
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
