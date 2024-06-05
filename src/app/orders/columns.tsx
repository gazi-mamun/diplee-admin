"use client";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import OrderForm from "@/components/order-items/OrderForm";

export type OrderType = {
  id: string;
  totalAmount: number;
  status: string;
  customerNumber: string;
  customerAddress: string;
  createdAt: string; // this one will be a Date type
  updatedAt: string; // this one will be a Date type
};

export const columns: ColumnDef<OrderType>[] = [
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
    header: "Customer Number",
    accessorKey: "customerNumber",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "CreatedAt",
    accessorKey: "createdAt",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt");
      const formatted = new Date(createdAt as string).toLocaleDateString();
      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
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
                navigator.clipboard.writeText(order.id.toString());
              }}
            >
              Copy Order Id
            </DropdownMenuItem>
            <OrderForm data={order} type="irregular" />
            <Link href={`/orders/details/${order.id}`}>
              <DropdownMenuItem className="cursor-pointer">
                View Order Details
              </DropdownMenuItem>
            </Link>
            <Link href={`/orders?customer_number=${order.customerNumber}`}>
              <DropdownMenuItem className="cursor-pointer">
                View Orders from this customer
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
