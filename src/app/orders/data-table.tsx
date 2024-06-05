"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalPages: number;
  currentPage: number;
}

export function OrderDataTable<TData, TValue>({
  columns,
  data,
  totalPages,
  currentPage,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [searchTerm, setSearchTerm] = useState<string>("");

  const [orders, setOrders] = useState<any>(null);

  const table = useReactTable({
    data: searchTerm == "" ? data : orders !== null ? orders : data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handlePrevClick = () => {
    router.push(
      pathname + "?" + createQueryString("page", `${currentPage - 1}`)
    );
  };

  const handleNextClick = () => {
    router.push(
      pathname + "?" + createQueryString("page", `${currentPage + 1}`)
    );
  };

  const handleStatusFilter = (value: string) => {
    let url = pathname + "?" + createQueryString("status", `${value}`);
    url = url.replace(`page=${currentPage}`, `page=1`);
    router.push(url);
  };

  const clearFilters = () => {
    const status = searchParams.get("status");
    const customerNumber = searchParams.get("customer_number");
    const fullUrl = window.location.href;
    let url = fullUrl.replace(`status=${status}`, "");
    url = url.replace(`customer_number=${customerNumber}`, "");
    router.push(url);
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm === "") {
      return;
    }
    try {
      const res = await axios.get(
        `https://api.diplee.com/orders/search?searchterm=${searchTerm}`,
        { withCredentials: true }
      );
      setOrders(res.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        throw error;
      }
    }
  };

  useEffect(() => {
    if (searchTerm == "") {
      setOrders(null);
    }
  }, [searchTerm]);

  return (
    <div>
      <div className="flex items-center py-4">
        <form onSubmit={(e) => handleSearch(e)} className="flex">
          <Input
            placeholder="Search order..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:w-[350px] min-w-[150px]"
          />

          {searchTerm !== "" && (
            <Button className="ml-4" type="submit">
              Search
            </Button>
          )}
        </form>

        {/* column visibility */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-4">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value: boolean) => {
                      column.toggleVisibility(!!value);
                    }}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* filter by instock */}
        <Select onValueChange={(value) => handleStatusFilter(value)}>
          <SelectTrigger className="w-[200px] ml-4">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="INDELIVERY">In delivery</SelectItem>
            <SelectItem value="DELIVERED">Delivered</SelectItem>
          </SelectContent>
        </Select>

        <div
          className="h-9 ml-4 flex justify-center items-center hover:underline"
          onClick={clearFilters}
        >
          <div className="flex cursor-pointer text-sm">
            <X className="mr-1 mt-0.5 h-4 w-4" />
            <p>Clear Filters</p>
          </div>
        </div>
      </div>

      {/* table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHeader>

          <TableBody>
            {table?.getRowModel().rows?.length ? (
              table?.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                <TableCell>No results</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* bottom */}
      <div className="flex justify-between align-bottom">
        <div className="flex-1 text-sm text-muted-foreground mt-5">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected
        </div>
        {/* pagination */}
        <div className="flex items-center justify-start space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevClick}
            disabled={currentPage == 1}
          >
            Previous
          </Button>
          <div className="flex-1 text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextClick}
            disabled={currentPage == totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default OrderDataTable;
