import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

/**
 * Presentational, server-rendered data table. Filtering/sorting/pagination
 * happen server-side via services + URL params (see SortableHeader,
 * DataTablePagination). Wraps in an overflow container for small screens.
 */

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  empty,
  className,
}: {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string | number;
  empty: { icon: LucideIcon; title: string; hint: string; action?: ReactNode };
  className?: string;
}) {
  if (rows.length === 0) {
    return <EmptyState {...empty} />;
  }

  return (
    <div className={cn("overflow-x-auto rounded-xl border bg-card", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={rowKey(row)}>
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
