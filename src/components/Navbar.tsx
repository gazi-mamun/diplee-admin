"use client";

import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { useGlobalContext } from "@/context";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, setUser } = useGlobalContext();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await axios.get(`https://api.diplee.com/auth/logout`, {
        withCredentials: true,
      });
      if (res) {
        localStorage.removeItem("user");
        setUser(null);
        router.push("/");
      }
      console.log(res);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        throw error;
      }
    }
  };

  return (
    <div className="bg-white border-b py-3 sticky top-0 left-0 z-50 shadow-sm">
      <MaxWidthWrapper className="md:px-[60px]">
        <ul className="w-full flex flex-wrap font-medium">
          <Link href="/products">
            <li className="py-1.5 px-5 rounded-md tracking-wide hover:bg-gray-100 cursor-pointer">
              Products
            </li>
          </Link>
          <Link href="/categories">
            <li className="py-1.5 px-5 rounded-md tracking-wide hover:bg-gray-100 cursor-pointer">
              Categories
            </li>
          </Link>

          <Link href="/users">
            <li className="py-1.5 px-5 rounded-md tracking-wide hover:bg-gray-100 cursor-pointer">
              Users
            </li>
          </Link>
          <Link href="/orders">
            <li className="py-1.5 px-5 rounded-md tracking-wide hover:bg-gray-100 cursor-pointer">
              Orders
            </li>
          </Link>
          {!user ? (
            <>
              <Link href="/">
                <li className="py-1.5 px-5 rounded-md tracking-wide hover:bg-gray-100 cursor-pointer">
                  Signin
                </li>
              </Link>
              <Link href="/signup">
                <li className="py-1.5 px-5 rounded-md tracking-wide hover:bg-gray-100 cursor-pointer">
                  Signup
                </li>
              </Link>
            </>
          ) : (
            <li
              className="py-1.5 px-5 rounded-md tracking-wide bg-red-500 hover:bg-red-300 cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </li>
          )}
        </ul>
      </MaxWidthWrapper>
    </div>
  );
}
