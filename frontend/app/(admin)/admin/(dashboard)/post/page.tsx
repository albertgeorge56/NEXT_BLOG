"use client";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { apiBaseUrl } from "@/app/(admin)/utils/config";
import { IPost, IPostResponse } from "@/app/(admin)/utils/types";
import { fetcher, postFetcher, useFetcher } from "@/app/(admin)/utils/helpers";
import CustomDataTable from "@/app/(admin)/components/CustomDataTable";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { DataTableColumn } from "mantine-datatable";
import { modals } from "@mantine/modals";
import { Box, Menu, Text, rem, ActionIcon } from "@mantine/core";
import {} from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import DeleteActionMenu from "@/app/(admin)/components/DeleteActionMenu";
import ActionMenuButton from "@/app/(admin)/components/ActionMenuButton";
import { useRouter } from "next/navigation";
dayjs.extend(advancedFormat);

export default function Category() {
  const { data, error } = useFetcher<IPostResponse>("posts");
  const router = useRouter();
  const [records, setRecords] = useState<IPost[]>([]);
  const handleDelete = async (id: any) => {
    await postFetcher("posts/delete", { id }, "posts", (err, dt) => {
      if (!err) notifications.show({ message: "Post deleted." });
    });
  };
  useEffect(() => {
    if (data) {
      setRecords(data.posts);
    }
  }, [data]);

  const columns: DataTableColumn[] = [
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
          <ActionMenuButton />
          <Menu.Dropdown>
            <Menu.Label>Actions</Menu.Label>
            <Menu.Item
              leftSection={<IconEdit size={17} />}
              onClick={() =>
                router.push(`/admin/post/manage/${(data as IPost).id}`)
              }
            >
              Edit
            </Menu.Item>
            <DeleteActionMenu
              row={data}
              onCancel={() => {}}
              onConfirm={() => handleDelete((data as IPost).id)}
            />
          </Menu.Dropdown>
        </Menu>
      ),
    },
  ];

  if (error) return <div>Error loading posts</div>;

  return (
    <>
      <h2>View Posts</h2>
      <CustomDataTable<IPost>
        records={records}
        totalRecords={data?.posts.length || 0}
        columns={columns}
        filterAccessors={["title", "content"]}
      />
    </>
  );
}
