import React, { useState } from "react";
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
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

function OrderItemAddForm({ orderId }: { orderId: string }) {
  const [productSku, setProductSku] = useState<any>("");
  const [productVariantSku, setProductVariantSku] = useState<any>("");
  const [quantity, setQuantity] = useState<any>("");

  const router = useRouter();

  const validation = (
    productSku: number,
    productVariantSku: number,
    quantity: number
  ) => {
    if (productSku === null || productSku === undefined || productSku <= 0) {
      toast.error("Please enter a product sku which is greater than zero");
      return false;
    }
    if (
      productVariantSku === null ||
      productVariantSku === undefined ||
      productVariantSku <= 0
    ) {
      toast.error(
        "Please enter a product variant sku which is greater than zero"
      );
      return false;
    }
    if (quantity === null || quantity === undefined || quantity <= 0) {
      toast.error(
        "Please enter a product variant sku which is greater than zero"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    const isValid = validation(+productSku, +productVariantSku, +quantity);
    if (!isValid) {
      return;
    }

    try {
      const res = await axios.post(
        `https://api.diplee.com/order-items`,
        {
          productSku: +productSku,
          productVariantSku: +productVariantSku,
          quantity: +quantity,
          orderId,
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
        <Button>Add new order item</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add new order item</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <div>
                <label htmlFor="productSku" className="block my-2">
                  Product Sku
                </label>
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  type="number"
                  id="productSku"
                  name="productSku"
                  min="1"
                  value={productSku}
                  onChange={(e) => setProductSku(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="productVariantSku" className="block my-2">
                  Product Variant Sku
                </label>
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  type="number"
                  id="productVariantSku"
                  name="productVariantSku"
                  min="1"
                  value={productVariantSku}
                  onChange={(e) => setProductVariantSku(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block my-2">
                  Quantity
                </label>
                <input
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default OrderItemAddForm;
