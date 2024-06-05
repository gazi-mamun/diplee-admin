import React from "react";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { cookies } from "next/headers";
import OrderDataTable from "./data-table";
import { columns } from "./columns";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders",
};

type Param = string | string[] | undefined;

interface OrdersPageProps {
  searchParams: { [key: string]: Param };
}

const parse = (param: Param) => {
  return typeof param === "string" ? param : undefined;
};

const getOrders = async (
  currentPage: string | undefined,
  status: string | undefined,
  customerNumber: string | undefined
) => {
  const res = await fetch(
    `https://api.diplee.com/orders?limit=25&page=${currentPage}&status=${status}&customerNumber=${customerNumber}`,
    {
      cache: "no-store",
      headers: { Cookie: cookies().toString() },
    }
  );

  return res.json();
};

const Order = async ({ searchParams }: OrdersPageProps) => {
  const page = parse(searchParams.page);
  const status = parse(searchParams.status);
  const customerNumber = parse(searchParams.customer_number);
  const { orders, totalPages, currentPage } = await getOrders(
    page,
    status,
    customerNumber
  );

  return (
    <MaxWidthWrapper>
      <h1 className="my-8 text-2xl font-bold">Orders</h1>
      <div className="w-full flex-1 flex-grow my-5">
        {orders?.length > 0 ? (
          <OrderDataTable
            columns={columns}
            data={orders}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        ) : (
          <h2 className="text-center text-xl mt-10">
            No order has been discovered
          </h2>
        )}
      </div>
    </MaxWidthWrapper>
  );
};

export default Order;
