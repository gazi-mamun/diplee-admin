"use client";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type ProductType = {
  id: string;
  sku: string;
  category: string;
  name: string;
  description: string;
  price: number;
  sale: boolean;
  discount: number;
  speciality: string;
  createdAt: string; // this one will be a Date type
  updatedAt: string; // this one will be a Date type
  inStock: number;
  primaryImageUrl: string;
};

export const columns: ColumnDef<ProductType>[] = [
  {
    id: "select",
    header: ({ table }) => {
      return (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value);
          }}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            row.toggleSelected(!!value);
          }}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "id",
    accessorKey: "id",
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          SKU
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "sku",
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Category",
    accessorKey: "category",
  },
  {
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === "asc");
          }}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorKey: "price",
  },
  {
    header: "Sale",
    accessorKey: "sale",
  },
  {
    header: "Discount",
    accessorKey: "discount",
  },
  {
    header: "Speciality",
    accessorKey: "speciality",
  },
  {
    header: "InStock",
    accessorKey: "inStock",
  },
  // {
  //   header: "UpdatedAt",
  //   accessorKey: "updatedAt",
  //   cell: ({ row }) => {
  //     const updatedAt = row.getValue("updatedAt");
  //     const formatted = new Date(updatedAt as string).toLocaleDateString();
  //     return <div className="font-medium">{formatted}</div>;
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(product.id.toString());
              }}
            >
              Copy Product Id
            </DropdownMenuItem>
            <Link href={`/products/update/${product.id}`}>
              <DropdownMenuItem className="cursor-pointer">
                Update Product
              </DropdownMenuItem>
            </Link>
            <Link href={`/products/details/${product.id}`}>
              <DropdownMenuItem className="cursor-pointer">
                View Product Details
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
