"use client";

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
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
} from "../ui/alert-dialog";

function ProductDetailsTable({ data }: { data: any }) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `https://api.diplee.com/products/${data.id}`,
        {
          withCredentials: true,
        }
      );
      if (res) {
        router.push("/products");
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
              {keyName !== "productImages" && keyName !== "productVariants" && (
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
      <div>
        <Link href={`/products/update/${data?.id}`}>
          <Button>Update product details</Button>
        </Link>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={"destructive"} className="ml-4">
              Delete this product
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                product.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}

export default ProductDetailsTable;
