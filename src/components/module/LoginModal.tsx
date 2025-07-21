"use client";

import { IUserInfo } from "@/types/StateTypes";
import axiosClient from "@/utils/axiosClient";
import { useState } from "react";

function LoginModal() {
  const [userInfo, setUserInfo] = useState<IUserInfo>({
    email: "",
    password: "",
  });

  const inputClass =
    "rounded-lg border-2 border-solid border-white px-6 py-3 placeholder:text-sm placeholder:font-bold placeholder:text-white/55 focus:outline-none text-white";

  const loginHandler = async (userInfo: {
    email: string;
    password: string;
  }) => {
    try {
      const res = await axiosClient.post("/register", { ...userInfo });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-6 flex flex-col items-center justify-center gap-8 rounded-lg border-2 border-solid border-white py-8">
      {/* user info inputs */}
      <div className="flex flex-col items-center justify-center gap-5 text-center">
        <input
          type="text"
          placeholder="آدرس ایمیل"
          value={userInfo.email}
          onChange={(e) =>
            setUserInfo((info) => ({ ...info, email: e.target.value }))
          }
          className={inputClass}
        />
        <input
          type="text"
          placeholder="رمز عبور"
          value={userInfo.password}
          onChange={(e) =>
            setUserInfo((info) => ({ ...info, password: e.target.value }))
          }
          className={inputClass}
        />
      </div>
      {/* login button */}
      <button
        disabled={!userInfo.email && !userInfo.password}
        onClick={() => loginHandler(userInfo)}
        className="blackColor rounded-lg bg-white px-8 py-2 font-bold disabled:cursor-not-allowed disabled:opacity-70"
      >
        ساخت حساب
      </button>
    </div>
  );
}

export default LoginModal;
