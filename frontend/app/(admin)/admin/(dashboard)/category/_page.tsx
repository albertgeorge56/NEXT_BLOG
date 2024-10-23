"use client";
import { ActionIcon, TextInput } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useDebouncedValue } from "@mantine/hooks";
import { DataTable, type DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState, useMemo } from "react";
import useSWR from "swr";
import { apiBaseUrl } from "@/app/(admin)/utils/config";
import { ICategory, ICategoryResponse } from "@/app/(admin)/utils/types";
import sortBy from "lodash/sortBy";
import { fetcher } from "@/app/(admin)/utils/helpers";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat);

const PAGE_SIZE = 5;

export default function Category() {
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<ICategory>>({
    columnAccessor: "name",
    direction: "asc",
  });
  const [page, setPage] = useState(1);
  const { data, error } = useSWR<ICategoryResponse>(
    `${apiBaseUrl}/categories`,
    fetcher
  );

  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(query, 200);

  const [records, setRecords] = useState<ICategory[]>([]);

  useEffect(() => {
    if (data) {
      const filteredCategories = data.categories.filter((category) =>
        category.title.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE;
      const sortedCategories = sortBy(
        filteredCategories,
        sortStatus.columnAccessor
      );
      setRecords(
        sortStatus.direction === "desc"
          ? sortedCategories.reverse().slice(from, to)
          : sortedCategories.slice(from, to)
      );
    }
  }, [page, data, sortStatus, debouncedQuery]);

  return (
    <DataTable
      records={records}
      height={380}
      columns={[
        {
          accessor: "Sr.",
          title: "S.No.",
          width: 100,
          render: (_, idx) => (page - 1) * PAGE_SIZE + idx + 1,
        },
        {
          accessor: "title",
          width: 100,
          sortable: true,
          filter: (
            <TextInput
              label="Titles"
              description="Show Titles"
              placeholder="Search titles..."
              leftSection={<IconSearch size={16} />}
              rightSection={
                <ActionIcon
                  size="sm"
                  variant="transparent"
                  c="dimmed"
                  onClick={() => setQuery("")}
                >
                  <IconX size={14} />
                </ActionIcon>
              }
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
            />
          ),
          filtering: false,
        },
        { accessor: "slug", width: 100 },
        { accessor: "content", width: 100 },
        {
          accessor: "createdAt",
          width: 100,
          render: ({ createdAt }) => dayjs(createdAt).format("Do MMM, YYYY"),
        },
      ]}
      totalRecords={data?.categories.length}
      recordsPerPage={PAGE_SIZE}
      page={page}
      onPageChange={setPage}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
    />
  );
}
