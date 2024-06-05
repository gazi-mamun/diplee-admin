"use client";

import React, { useContext, useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { checkUnreadNotifications } from "./utils/forFetch";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  // FOR PROFILE PART
  const [user, setUser] = useState(null);
  const [selectedProduct,setSelectedProduct] = useState(null);
  // const [socket, setSocket] = useState(null);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
    // if (user) checkUnreadNotifications(setHasUnread);
  }, []);

  useEffect(() => {
    if (user !== null || undefined) {
      localStorage.setItem("user", JSON.stringify(user));
      // checkUnreadNotifications(setHasUnread);
      // setSocket(io("http://localhost:5000"));
      setTimeout(() => {
        localStorage.removeItem("user");
      }, 86400000);
    }
  }, [user]);

  // useEffect(() => {
  //   if (socket !== null && user) {
  //     socket.emit("newUser", { userId: user?.id, userRole: user.role });
  //     socket.on("getNotification", (data) => {
  //       setNotifications((prev) => [data, ...prev]);
  //       setHasUnread(true);
  //     });
  //   }
  // }, [socket]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        selectedProduct,
        setSelectedProduct
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// making context global
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
