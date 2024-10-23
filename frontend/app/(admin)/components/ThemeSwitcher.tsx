"use client";
import {
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  Chip,
  Button,
} from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";
export default function ThemeSwitcher() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });
  return (
    <>
      <ActionIcon
        onClick={() =>
          setColorScheme(computedColorScheme === "light" ? "dark" : "light")
        }
        classNames={{
          root: "border-none",
        }}
        variant="default"
        size="lg"
        aria-label="Toggle color scheme"
      >
        <IconSun
          size={20}
          className={`${computedColorScheme === "light" ? "hidden" : ""}`}
          stroke={1.5}
        />
        <IconMoon
          size={20}
          className={`${computedColorScheme === "dark" ? "hidden" : ""}`}
          stroke={1.5}
        />
      </ActionIcon>
    </>
  );
}
