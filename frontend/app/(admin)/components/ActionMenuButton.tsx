"use client";
import { ActionIcon, Menu } from "@mantine/core";
import { IconDotsVertical } from "@tabler/icons-react";

export default function ActionMenuButton() {
  return (
    <Menu.Target>
      <ActionIcon variant="default" size="md">
        <IconDotsVertical size={17} stroke={1.5} />
      </ActionIcon>
    </Menu.Target>
  );
}
