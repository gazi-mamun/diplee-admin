import React from "react";
import { ProductType, columns } from "./columns";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductDataTable from "./data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
};

type Param = string | string[] | undefined;

interface ProductsPageProps {
  searchParams: { [key: string]: Param };
}

const parse = (param: Param) => {
  return typeof param === "string" ? param : undefined;
};

const getProducts = async (
  currentPage: string | undefined,
  sortby: string | undefined,
  instock: string | undefined,
  category: string | undefined
) => {
  console.log(category);
  const res = await fetch(
    `https://api.diplee.com/products?limit=25&page=${currentPage}&sortby=${sortby}&instock=${instock}&category=${category}`,
    {
      cache: "no-store",
    }
  );

  return res.json();
};

const getCategories = async () => {
  const res = await fetch(`https://api.diplee.com/categories`, {
    cache: "no-store",
  });

  return res.json();
};

export default async function page({ searchParams }: ProductsPageProps) {
  const page = parse(searchParams.page);
  const sortby = parse(searchParams.sortby);
  const instock = parse(searchParams.instock);
  const category = parse(searchParams.category);
  const { products, totalPages, currentPage } = await getProducts(
    page,
    sortby,
    instock,
    category
  );

  const categories = await getCategories();

  return (
    <MaxWidthWrapper>
      <h1 className="my-8 text-2xl font-bold">Products</h1>
      <div className="w-full flex-1 flex-grow my-5">
        {products?.length > 0 ? (
          <ProductDataTable
            columns={columns}
            data={products}
            categories={categories}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        ) : (
          <>
            <Link href={"/products/add"}>
              <Button>Add New Product</Button>
            </Link>
            <h2 className="text-center text-xl mt-10">
              No product has been discovered
            </h2>
          </>
        )}
      </div>
    </MaxWidthWrapper>
  );
}
