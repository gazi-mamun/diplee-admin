import React from "react";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { isValid, number } from "zod";

function OrderForm({ data, type }: { data: any; type: string }) {
  const [customerNumber, setCustomerNumber] = useState<string>(
    data?.customerNumber
  );
  const [customerAddress, setCustomerAddress] = useState<string>(
    data?.customerAddress
  );
  const [status, setStatus] = useState<string>(data?.status);

  const router = useRouter();

  const validation = (number: string, address: string, status: string) => {
    if (number === "" || number.length > 11) {
      toast.error("Please enter a valid phone number");
      return false;
    }
    if (address === "") {
      toast.error("Please enter your address in details");
      return false;
    }

    return true;
  };

  const handleQuantityChange = async () => {
    const isValid = validation(customerNumber, customerAddress, status);
    if (!isValid) {
      return;
    }

    try {
      const res = await axios.patch(
        `https://api.diplee.com/orders/${data.id}`,
        {
          customerNumber,
          customerAddress,
          status,
        },
        { withCredentials: true }
      );
      if (res) {
        router.refresh();
      }
    } catch (error) {
      setCustomerAddress(data?.customerAddress);
      setCustomerNumber(data?.customerNumber);
      setStatus(data.status);
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
        <Button
          variant={`${type === "irregular" ? "ghost" : "default"}`}
          className="cursor-pointer"
        >
          Update Order
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add new order item- </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <div className="mb-4">
                <Label htmlFor="customerNumber">Customer Number</Label>
                <Input
                  className="mt-2"
                  name="customerNumber"
                  value={customerNumber}
                  onChange={(e) => setCustomerNumber(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="customerAddress">Customer Address</Label>
                <Input
                  className="mt-2"
                  name="customerAddress"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="status">Order Status</Label>
                <Select onValueChange={(value) => setStatus(value)}>
                  <SelectTrigger className="w-[200px] mt-2">
                    <SelectValue placeholder="Select Order Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      className={`${status === "PENDING" && "text-green-500"}`}
                      value="PENDING"
                      disabled={status === "PENDING" && true}
                    >
                      Pending
                    </SelectItem>
                    <SelectItem
                      className={`${
                        status === "INDELIVERY" && "text-green-500"
                      }`}
                      disabled={status === "INDELIVERY" && true}
                      value="INDELIVERY"
                    >
                      In Delivery
                    </SelectItem>
                    <SelectItem
                      className={`${
                        status === "DELIVERED" && "text-green-500"
                      }`}
                      disabled={status === "DELIVERED" && true}
                      value="DELIVERED"
                    >
                      Delivered
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleQuantityChange}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default OrderForm;
