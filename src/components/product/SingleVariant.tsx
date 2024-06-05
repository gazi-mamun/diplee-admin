"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import axios, { AxiosError } from "axios";
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
import toast from "react-hot-toast";

type ProductVariant = {
  id: string;
  sku: number;
  productId: string;
  size: string;
  color: string;
  inStock: number;
};

function SingleVariant({
  type,
  data,
  productId,
}: {
  type: string;
  data?: ProductVariant;
  productId: string;
}) {
  const [sku, setSku] = useState<any>(null);
  const [size, setSize] = useState<any>(null);
  const [color, setColor] = useState<any>(null);
  const [inStock, setInStock] = useState<any>(null);

  const [isDataChanged, setIsDataChanged] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    if (data) {
      setSku(data?.sku);
      setSize(data?.size);
      setColor(data?.color);
      setInStock(data?.inStock);
    }
  }, []);

  useEffect(() => {
    if (type === "add") {
      if (sku !== null || size !== null || color !== null || inStock !== null) {
        setIsDataChanged(true);
      } else {
        setIsDataChanged(false);
      }
    } else {
      if (data) {
        if (
          sku !== data.sku ||
          size !== data.size ||
          color !== data.color ||
          inStock !== data.inStock
        ) {
          setIsDataChanged(true);
        } else {
          setIsDataChanged(false);
        }
      }
    }
  }, [sku, size, color, inStock]);

  const handleCancel = () => {
    setIsDataChanged(false);
    if (type === "add") {
      setSku(null);
      setSize(null);
      setColor(null);
      setInStock(null);
    } else {
      setSku(data?.sku);
      setSize(data?.size);
      setColor(data?.color);
      setInStock(data?.inStock);
    }
  };

  const dataValidation = (
    sku: number,
    size: string,
    color: string,
    inStock: number
  ) => {
    if (sku == null || size == null || color == null || inStock == null) {
      return false;
    }

    if (size.length < 1 || size.length > 20) {
      return false;
    }
    if (color.length < 2 || color.length > 50) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const inStockInt = parseInt(inStock);
      const isValid = dataValidation(sku, size, color, inStockInt);
      if (isValid) {
        const payload = {
          productId,
          sku: sku.toString(),
          size,
          color,
          inStock: inStockInt,
        };
        let res;
        if (type === "add") {
          res = await axios.post(
            "https://api.diplee.com/product-variants",
            payload,
            { withCredentials: true }
          );
        } else {
          res = await axios.patch(
            `https://api.diplee.com/product-variants/${data?.id}`,
            payload,
            { withCredentials: true }
          );
        }
        if (res) {
          router.refresh();
          setIsDataChanged(false);
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        throw error;
      }
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `https://api.diplee.com/product-variants/${data?.id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data) {
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className={`w-full grid grid-cols-2 ${
        type == "update" ? "md:grid-cols-5" : "md:grid-cols-4"
      } gap-2 border-2 p-2 py-4 border-white bg-gray-100 rounded-sm`}
      onSubmit={handleSubmit}
    >
      <input
        type="number"
        placeholder="sku"
        className="border-2 px-1 py-1 rounded-md outline-none my-1 md:my-2"
        value={sku || ""}
        onChange={(e) => setSku(e.target.value)}
      />
      <input
        type="text"
        placeholder="size"
        className="border-2 px-1 py-1 rounded-md outline-none my-1 md:my-2"
        value={size || ""}
        onChange={(e) => setSize(e.target.value)}
      />
      <input
        type="text"
        placeholder="color"
        className="border-2 px-1 py-1 rounded-md outline-none my-1 md:my-2"
        value={color || ""}
        onChange={(e) => setColor(e.target.value)}
      />
      <input
        type="number"
        placeholder="in stock"
        className="border-2 px-1 py-1 rounded-md outline-none my-1 md:my-2"
        value={inStock || ""}
        onChange={(e) => setInStock(e.target.value)}
      />
      {type == "update" && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={"destructive"} className="mt-2 h-[33px]">
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                product variant.
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
      )}
      {isDataChanged && (
        <>
          <Button variant={"default"} type="submit">
            {type == "add" ? "Add variant" : "Update"}
          </Button>
          <Button variant={"ghost"} onClick={handleCancel}>
            Cancel
          </Button>
        </>
      )}
    </form>
  );
}

export default SingleVariant;
