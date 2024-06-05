import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import UserDetailsTable from "@/components/UserDetailsTable";
import { cookies } from "next/headers";
import React from "react";

const getUser = async (id: string) => {
  const res = await fetch(`https://api.diplee.com/users/${id}`, {
    cache: "no-store",
    headers: { Cookie: cookies().toString() },
  });
  return res.json();
};

async function page({ params }: { params: { id: string } }) {
  const user = await getUser(params.id);

  return (
    <MaxWidthWrapper>
      <h1 className="my-8 text-2xl font-bold">User Details</h1>
      <UserDetailsTable data={user} />
    </MaxWidthWrapper>
  );
}

export default page;
