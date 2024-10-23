import { DataTable, type DataTableSortStatus } from "mantine-datatable";
import { useEffect, useState } from "react";
import sortBy from "lodash/sortBy";
import { ActionIcon, TextInput } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";

interface CustomDataTableProps<T> {
  records: T[];
  totalRecords: number;
  columns: any[];
  filterAccessors: (keyof T)[];
  pageSize?: number;
}

export default function CustomDataTable<T>({
  records,
  totalRecords,
  columns,
  filterAccessors,
  pageSize = 5,
}: CustomDataTableProps<T>) {
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<T>>({
    columnAccessor: columns[0].accessor,
    direction: "asc",
  });

  const [page, setPage] = useState(1);
  const [queries, setQueries] = useState<Record<keyof T, string>>(
    filterAccessors.reduce(
      (acc, key) => {
        acc[key] = "";
        return acc;
      },
      {} as Record<keyof T, string>
    )
  );

  const [filteredRecords, setFilteredRecords] = useState<T[]>(records);

  const [isFiltering, setIsFiltering] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<keyof T>();

  useEffect(() => {
    let filteredData = records;
    Object.keys(queries).forEach((key) => {
      if (queries[key as keyof T]) {
        filteredData = filteredData.filter((record) =>
          (record[key as keyof T] as string)
            .toLowerCase()
            .includes(queries[key as keyof T].toLowerCase())
        );
      }
    });
    const sortedData = sortBy(filteredData, sortStatus.columnAccessor);
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setFilteredRecords(
      sortStatus.direction === "desc"
        ? sortedData.reverse().slice(from, to)
        : sortedData.slice(from, to)
    );
  }, [records, page, sortStatus, queries, selectedFilter, pageSize]);

  return (
    <DataTable
      textSelectionDisabled
      withTableBorder
      borderRadius="md"
      shadow="lg"
      withColumnBorders
      records={filteredRecords}
      height={330}
      columns={[
        {
          accessor: "Sr.",
          title: "S.No.",
          width: 50,
          render: (_, idx) => (page - 1) * pageSize + idx + 1,
        },
        ...columns.map((column) => ({
          ...column,
          ...(filterAccessors.includes(column.accessor) && {
            filter: (
              <TextInput
                label={`Search by ${column.accessor}`}
                placeholder={`Search ${column.accessor}...`}
                value={queries[column.accessor as keyof T] || ""}
                leftSection={<IconSearch size={16} />}
                rightSection={
                  <ActionIcon
                    size="sm"
                    variant="transparent"
                    c="dimmed"
                    onClick={() =>
                      setQueries({ ...queries, [column.accessor]: "" })
                    }
                  >
                    <IconX size={14} />
                  </ActionIcon>
                }
                onFocus={() => {
                  setIsFiltering(true);
                  setSelectedFilter(column.accessor);
                }}
                onBlur={() => setIsFiltering(false)}
                onChange={(e) =>
                  setQueries({
                    ...queries,
                    [column.accessor]: e.currentTarget.value,
                  })
                }
              />
            ),
            filtering: queries[column.accessor as keyof T] !== "",
          }),
        })),
      ]}
      totalRecords={totalRecords}
      recordsPerPage={pageSize}
      page={page}
      onPageChange={setPage}
      sortStatus={sortStatus}
      onSortStatusChange={(sortStatus: DataTableSortStatus<T>) => {
        if (!isFiltering) setSortStatus(sortStatus);
      }}
    />
  );
}
