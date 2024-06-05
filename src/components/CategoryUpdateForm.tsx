"use client";

import React from "react";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Input } from "./ui/input";

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
import { Button } from "./ui/button";

function CategoryUpdateForm({ data }: { data: any }) {
  const [categoryName, setCategoryName] = useState<any>(data?.name);

  const router = useRouter();

  const handleCategoryUpdate = async () => {
    if (categoryName == "") {
      toast.error("Please enter a category name");
    }
    try {
      const res = await axios.patch(
        `https://api.diplee.com/categories/${data.id}`,
        {
          name: categoryName,
        },
        { withCredentials: true }
      );
      if (res) {
        router.refresh();
      }
    } catch (error) {
      setCategoryName(data.name);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        throw error;
      }
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"ghost"} className="cursor-pointer">
          Update category
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Category-</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <Input
              className="my-2"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleCategoryUpdate}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CategoryUpdateForm;
