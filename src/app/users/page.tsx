import React from "react";
import { UserDataTable } from "./data-table";
import { columns } from "./columns";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { cookies } from "next/headers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
};

type Param = string | string[] | undefined;

interface UsersPageProps {
  searchParams: { [key: string]: Param };
}

const parse = (param: Param) => {
  return typeof param === "string" ? param : undefined;
};

const getUsers = async (currentPage: string | undefined) => {
  const res = await fetch(
    `https://api.diplee.com/users?limit=25&page=${currentPage}`,
    {
      cache: "no-store",
      headers: { Cookie: cookies().toString() },
    }
  );

  return res.json();
};

const User = async ({ searchParams }: UsersPageProps) => {
  const page = parse(searchParams.page);
  const { users, totalPages, currentPage } = await getUsers(page);

  return (
    <MaxWidthWrapper>
      <h1 className="my-8 text-2xl font-bold">Users</h1>
      <div className="w-full flex-1 flex-grow my-5">
        {users?.length > 0 ? (
          <UserDataTable
            columns={columns}
            data={users}
            totalPages={totalPages}
            currentPage={currentPage}
          />
        ) : (
          <h2 className="text-center text-xl mt-10">
            No user has been discovered
          </h2>
        )}
      </div>
    </MaxWidthWrapper>
  );
};

export default User;
