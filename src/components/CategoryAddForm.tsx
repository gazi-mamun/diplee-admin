"use client";

import React, { useEffect } from "react";
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

function CategoryAddForm() {
  const [categoryName, setCategoryName] = useState<any>("");

  const router = useRouter();

  const handleCategoryUpdate = async () => {
    if (categoryName == "") {
      toast.error("Please enter a category name");
    }
    try {
      const res = await axios.post(
        `https://api.diplee.com/categories/`,
        {
          name: categoryName,
        },
        { withCredentials: true }
      );
      if (res) {
        router.refresh();
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="cursor-pointer">Add new Category</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Category-</AlertDialogTitle>
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

export default CategoryAddForm;
