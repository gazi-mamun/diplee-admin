import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductDetailsTable from "@/components/product/ProductDetailsTable";
import ProductImgGal from "@/components/product/ProductImgGal";
import ProductVariants from "@/components/product/ProductVariants";
import React from "react";

const getProduct = async (id: string) => {
  const res = await fetch(`https://api.diplee.com/products/${id}`, {
    cache: "no-store",
  });
  return res.json();
};

async function page({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  return (
    <MaxWidthWrapper>
      <h1 className="my-8 text-2xl font-bold">Product Details</h1>
      <ProductDetailsTable data={product} />
      <h2 className="my-8 text-2xl font-bold">Variants</h2>
      <ProductVariants
        data={product?.productVariants}
        productId={product?.id}
      />
      <h2 className="my-8 text-2xl font-bold">Images</h2>
      <ProductImgGal
        data={product?.productImages}
        productId={product?.id}
        primaryProductImage={product?.primaryImageUrl}
      />
    </MaxWidthWrapper>
  );
}

export default page;
