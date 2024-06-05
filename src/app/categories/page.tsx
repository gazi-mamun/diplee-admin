import React from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import CategoryDataTable from "./data-table";
import { columns } from "./columns";
import CategoryAddForm from "@/components/CategoryAddForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
};

const getCategories = async () => {
  const res = await fetch(`https://api.diplee.com/categories`, {
    cache: "no-store",
  });

  return res.json();
};

const Category = async () => {
  const categories = await getCategories();

  return (
    <MaxWidthWrapper>
      <h1 className="my-8 text-2xl font-bold">Categories</h1>
      <div className="w-full flex-1 flex-grow my-5">
        <CategoryAddForm />
        {categories?.length > 0 ? (
          <CategoryDataTable columns={columns} data={categories} />
        ) : (
          <h2 className="text-center text-xl mt-10">
            No category has been discovered
          </h2>
        )}
      </div>
    </MaxWidthWrapper>
  );
};

export default Category;
