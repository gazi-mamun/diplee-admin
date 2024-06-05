import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { cookies } from "next/headers";
import React from "react";
import OrderDetailsTable from "@/components/OrderDetailsTable";
import OrderItemDataTable from "@/components/order-items/data-table";
import { columns } from "@/components/order-items/columns";

const getOrder = async (id: string) => {
  const res = await fetch(`https://api.diplee.com/orders/${id}`, {
    cache: "no-store",
    headers: { Cookie: cookies().toString() },
  });
  return res.json();
};

async function page({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id);

  return (
    <MaxWidthWrapper>
      <h1 className="my-8 text-2xl font-bold">Order Details</h1>
      <OrderDetailsTable data={order} />
      {order.orderItems.length > 0 && (
        <>
          <h2 className="my-8 text-2xl font-bold">Ordered Items</h2>
          <OrderItemDataTable
            columns={columns}
            data={order.orderItems}
            orderId={order.id}
          />
        </>
      )}
    </MaxWidthWrapper>
  );
}

export default page;
