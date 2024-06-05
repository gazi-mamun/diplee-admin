import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { ProductForm } from "@/components/product/ProductForm";
import React from "react";

function page() {
  return (
    <MaxWidthWrapper>
      <h1 className="my-8 text-2xl font-bold">Update Product</h1>
      <div className="flex items-center justify-center my-5">
        <div className="md:w-2/4 w-full">
          <ProductForm type="update" />
        </div>
      </div>
    </MaxWidthWrapper>
  );
}

export default page;
