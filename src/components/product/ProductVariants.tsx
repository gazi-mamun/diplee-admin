"use client";

import React from "react";
import SingleVariant from "./SingleVariant";

type ProductVariant = {
  id: string;
  sku: number;
  productId: string;
  size: string;
  color: string;
  inStock: number;
};

function ProductVariants({
  data,
  productId,
}: {
  data: [ProductVariant];
  productId: string;
}) {
  return (
    <div>
      {data?.length <= 0 ? (
        <>
          <p>No variant has been found.</p>
          <SingleVariant type="add" productId={productId} />
        </>
      ) : (
        <>
          <SingleVariant type="add" productId={productId} />
          {data.map((variant) => (
            <SingleVariant
              type="update"
              data={variant}
              productId={productId}
              key={variant.id}
            />
          ))}
        </>
      )}
    </div>
  );
}

export default ProductVariants;
