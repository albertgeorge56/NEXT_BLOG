"use client";
import { useEffect, useState } from "react";
import { ICategory, ICategoryResponse } from "@/app/(admin)/utils/types";
import { fetcher, postFetcher, useFetcher } from "@/app/(admin)/utils/helpers";
import CustomDataTable from "@/app/(admin)/components/CustomDataTable";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { ActionIcon, Box, Menu } from "@mantine/core";
import { IconDotsVertical, IconEdit } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import DeleteActionMenu from "@/app/(admin)/components/DeleteActionMenu";
import { useRouter } from "next/navigation";
dayjs.extend(advancedFormat);
export default function Category() {
  const { data, error } = useFetcher<ICategoryResponse>("categories");
  const [records, setRecords] = useState<ICategory[]>([]);
  const router = useRouter();
  useEffect(() => {
    if (data) {
      setRecords(data.categories);
    }
  }, [data]);

  const handleDelete = async (id: any) => {
    await postFetcher(
      `categories/delete`,
      { id },
      "categories",
      (err, data) => {
        if (err) {
          notifications.show({
            message: "Category cannot be deleted.",
            color: "red",
          });
          return;
        }
        notifications.show({ message: "Category deleted." });
      }
    );
  };

  const columns = [
    {
      accessor: "title",
      width: 100,
      sortable: true,
    },
    { accessor: "slug", width: 100 },
    { accessor: "content", width: 100 },
    {
      accessor: "createdAt",
      width: 100,
      render: ({ createdAt }: any) => dayjs(createdAt).format("Do MMM, YYYY"),
    },
    {
      accessor: "actions",
      title: <Box mr={6}>Action</Box>,
      width: "0%",
      textAlign: "center",
      render: (data: any) => (
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Menu.Target>
              <ActionIcon variant="default" size="md">
                <IconDotsVertical size={17} stroke={1.5} />
              </ActionIcon>
            </Menu.Target>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Actions</Menu.Label>
            <Menu.Item
              leftSection={<IconEdit size={14} />}
              onClick={() =>
                router.push(`/admin/category/manage/${(data as ICategory).id}`)
              }
            >
              Edit
            </Menu.Item>
            <DeleteActionMenu
              row={data}
              onCancel={() => {}}
              onConfirm={() => handleDelete((data as ICategory).id)}
            />
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];
  if (error) return <div>Error loading categories</div>;

  return (
    <>
      <h2>View Category</h2>
      <CustomDataTable<ICategory>
        records={records}
        totalRecords={data?.categories.length || 0}
        columns={columns}
        filterAccessors={["title", "content"]}
      />
    </>
  );
}
