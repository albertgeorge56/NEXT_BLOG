import { createTheme, NavLink, PasswordInput, TextInput } from "@mantine/core";
import { transform } from "next/dist/build/swc";

const theme = createTheme({
  colors: {
    dark: [
      "#f4f4f5",
      "#e4e4e7",
      "#d4d4d8",
      "#a1a1aa",
      "#71717a",
      "#52525b",
      "#3f3f46",
      "#27272a",
      "#18181b",
      "#09090b",
    ],
    "primary-color": [
      "#e1f8ff",
      "#cbedff",
      "#9ad7ff",
      "#64c1ff",
      "#3aaefe",
      "#20a2fe",
      "#099cff",
      "#0088e4",
      "#0079cd",
      "#0068b6",
    ],
  },
  primaryColor: "primary-color",
  components: {
    NavLink: {
      classNames: {
        root: "text-white rounded-md hover:bg-white hover:text-zinc-800",
      },
    },
    TextInput: {
      classNames: {
        label: "mb-2",
      },
    },
    PasswordInput: {
      classNames: {
        label: "mb-2",
      },
    },
    Button: {
      styles: {
        root: {
          transform: "translateY(0)",
        },
      },
    },
    ActionIcon: {
      styles: {
        root: {
          transform: "translateY(0)",
        },
      },
    },
  },
});
export default theme;
