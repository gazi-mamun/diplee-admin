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
} from "./ui/alert-dialog";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function UserRoleChangeForm({ data }: { data: any }) {
  const [userRole, setUserRole] = useState<any>(data.role);

  const router = useRouter();

  const handleSubmit = async () => {
    if (userRole === data.role) {
      return;
    }
    try {
      const res = await axios.patch(
        `https://api.diplee.com/users/${data.id}`,
        {
          role: userRole,
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
        <Button variant={"ghost"}>Change User Role</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change user role-</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <Select onValueChange={(value) => setUserRole(value)}>
                <SelectTrigger className="w-[200px] mt-2">
                  <SelectValue placeholder="Select User Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    className={`${userRole === "ADMIN" && "text-green-500"}`}
                    disabled={userRole === "ADMIN" && true}
                    value="ADMIN"
                  >
                    Admin
                  </SelectItem>
                  <SelectItem
                    className={`${
                      userRole === "MODERATOR" && "text-green-500"
                    }`}
                    value="MODERATOR"
                    disabled={userRole === "MODERATOR" && true}
                  >
                    Moderator
                  </SelectItem>
                  <SelectItem
                    className={`${userRole === "USER" && "text-green-500"}`}
                    disabled={userRole === "USER" && true}
                    value="USER"
                  >
                    User
                  </SelectItem>
                </SelectContent>
              </Select>
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

export default UserRoleChangeForm;
