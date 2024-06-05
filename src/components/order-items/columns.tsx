"use client";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

import QuantityChangeForm from "./QuantityChangeForm";
import OrderItemDeleteForm from "./OrderItemDeleteForm";

export type OrderItemType = {
  id: string;
  productSku: number;
  productVariantSku: number;
  size: string;
  color: string;
  quantity: string;
  price: number;
};

export const columns: ColumnDef<OrderItemType>[] = [
  {
    header: "Product Sku",
    accessorKey: "productSku",
  },
  {
    header: "Product Variant Sku",
    accessorKey: "productVariantSku",
  },
  {
    header: "Size",
    accessorKey: "size",
  },
  {
    header: "Color",
    accessorKey: "color",
  },
  {
    header: "Quantity",
    accessorKey: "quantity",
  },
  {
    header: "Price",
    accessorKey: "price",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const orderItem = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <QuantityChangeForm data={orderItem} />
            <OrderItemDeleteForm data={orderItem} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
