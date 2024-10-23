"use client";
import { Menu, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconTrash } from "@tabler/icons-react";

interface DeleteActionMenuProps {
  row: any;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteActionMenu({
  row,
  onCancel,
  onConfirm,
}: DeleteActionMenuProps) {
  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: "Are you sure?",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete? This action is destructive.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "No don't delete it" },
      confirmProps: { color: "red" },
      onCancel,
      onConfirm,
    });

  return (
    <Menu.Item
      color="red"
      onClick={() => openDeleteModal()}
      leftSection={<IconTrash size={16} />}
    >
      Delete
    </Menu.Item>
  );
}
