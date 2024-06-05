"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import OrderForm from "./order-items/OrderForm";

function OrderDetailsTable({ data }: { data: any }) {
  const router = useRouter();

  const handleOrderDelete = async () => {
    try {
      const res = await axios.delete(
        `https://api.diplee.com/orders/${data.id}`,
        {
          withCredentials: true,
        }
      );
      if (res) {
        router.push("/orders");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        throw error;
      }
    }
  };

  return (
    <>
      <table className="my-5 w-full">
        <tbody>
          {Object.keys(data).map((keyName, i) => (
            <tr
              key={i}
              className={`font-medium text-base tracking-wide w-full ${
                i % 2 == 0 ? "bg-gray-50" : "bg-gray-100"
              }`}
            >
              {keyName !== "orderItems" && (
                <>
                  <th className="p-3 text-left uppercase border-r-4 border-white">
                    {keyName}
                  </th>
                  <td className="px-3 w-full">{data[keyName]}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <OrderForm data={data} type="regular" />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={"destructive"} className="ml-4">
            Delete this order
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleOrderDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default OrderDetailsTable;
