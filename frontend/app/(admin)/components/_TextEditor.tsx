"use client";
import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";
import { tinyMCEApiKey } from "../utils/config";

import { useComputedColorScheme, useMantineColorScheme } from "@mantine/core";

interface TinyMCEEditorProps {
  error: any;
  initialValue: string;
  onChange: (content: string, editor: TinyMCEEditor) => void;
}

export default function TextEditor({
  error,
  initialValue,
  onChange,
}: TinyMCEEditorProps) {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const colorScheme = useMantineColorScheme();
  console.log(colorScheme.colorScheme);
  return (
    <>
      <Editor
        apiKey={tinyMCEApiKey}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={initialValue}
        init={{
          height: 400,
          menubar: false,
          skin: `${colorScheme.colorScheme == "dark" ? "oxide-dark" : "oxide"}`,
          content_css: `${colorScheme.colorScheme == "dark" ? "dark" : "default"}`,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style: `body { font-family:Helvetica,Arial,sans-serif; font-size:14px;}`,
        }}
        onEditorChange={onChange}
      />
      {error && <div style={{ color: "red" }}>{error}</div>}{" "}
    </>
  );
}
