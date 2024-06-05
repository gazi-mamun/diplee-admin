"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
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
} from "./ui/alert-dialog";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

function UserDetailsTable({ data }: { data: any }) {
  const router = useRouter();

  const handleUserDelete = async () => {
    try {
      const res = await axios.delete(
        `https://api.diplee.com/users/${data.id}`,
        {
          withCredentials: true,
        }
      );
      if (res) {
        router.push("/users");
      }
    } catch (error) {
      setNewRole(null);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        throw error;
      }
    }
  };

  const [newRole, setNewRole] = useState<string | null>(null);

  const roles = ["USER", "MODERATOR", "ADMIN"];

  const changeRole = async () => {
    try {
      const res = await axios.patch(
        `https://api.diplee.com/users/${data.id}`,
        {
          role: newRole,
        },
        { withCredentials: true }
      );
      if (res) {
        router.refresh();
      }
    } catch (error) {
      setNewRole(null);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        throw error;
      }
    }
  };

  return (
    <>
      <table className="my-5 w-full">
        <tbody>
          {Object.keys(data).map((keyName, i) => (
            <tr
              key={i}
              className={`font-medium text-base tracking-wide w-full ${
                i % 2 == 0 ? "bg-gray-50" : "bg-gray-100"
              }`}
            >
              {keyName !== "productImages" && keyName !== "productVariants" && (
                <>
                  <th className="p-3 text-left uppercase border-r-4 border-white">
                    {keyName}
                  </th>
                  <td className="px-3 w-full">
                    {data[keyName]}
                    {keyName === "role" && (
                      <>
                        {roles.map((role: string, index: number) => (
                          <AlertDialog key={index}>
                            <AlertDialogTrigger asChild>
                              <span
                                key={index}
                                className="lowercase ml-6 text-blue-400 underline cursor-pointer
                                "
                                onClick={() => setNewRole(role)}
                              >
                                {role !== data[keyName] && role}
                              </span>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you absolutely sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action will change this user's role to{" "}
                                  {role}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={changeRole}>
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ))}
                      </>
                    )}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={"destructive"}>Delete this user</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUserDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default UserDetailsTable;
