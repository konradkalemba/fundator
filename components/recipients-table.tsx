"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  TableMeta,
  RowData,
  CellContext,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { z } from "zod";
import { fillSponsorshipRecipientSchema } from "@/lib/validations/sponsorships";
import { useFormField } from "./ui/form";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

type Recipient = z.infer<typeof fillSponsorshipRecipientSchema>;

function TableEditableCell({
  getValue,
  row: { index },
  column: { id },
  table,
}: CellContext<Recipient, unknown>) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  // When the input is blurred, we'll call our table meta's updateData function
  const onBlur = () => {
    table.options.meta?.updateData(index, id, value);
  };

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      value={value as string}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
    />
  );
}

export const columns: ColumnDef<Recipient>[] = [
  {
    accessorKey: "login",
    header: "GitHub Login",
    cell: TableEditableCell,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: TableEditableCell,
  },
];

interface RecipientsTableProps {
  data: Recipient[];
  onChange: (data: Recipient[]) => void;
}

export function RecipientsTable({ data, onChange }: RecipientsTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        const newData = data.map((row: Recipient, index: number) => {
          if (index === rowIndex) {
            return {
              ...data[rowIndex]!,
              [columnId]: value,
            };
          }
          return row;
        });
        onChange(newData);
      },
    },
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="border shadow-sm bg-white border-gray-100 rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Button
        size="sm"
        className="self-end"
        variant="secondary"
        onClick={() => onChange([...data, { login: "", amount: 10 }])}
      >
        Add recipient
      </Button>
    </div>
  );
}
