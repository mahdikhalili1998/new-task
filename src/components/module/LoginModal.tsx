"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { loginUser } from "@/redux/authSlice";
import { IUserInfo } from "@/types/StateTypes";
import toast, { Toaster } from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import Image from "next/image";

function LoginModal() {
  const [userInfo, setUserInfo] = useState<IUserInfo>({
    email: "",
    password: "",
  });

  const [register, setRegister] = useState<boolean>(false);

  const router = useRouter();

  const dispatch = useAppDispatch();
  const { loading, error, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      if (!register) {
        toast.success("ورود با موفقیت انجام شد 🎉");
      } else {
        toast.success("حساب با موفقیت ساخته شد ");
      }

      router.push("/users"); // اینجا صفحه مقصدت رو بنویس
    }
    if (error) toast.error(error);
  }, [token, error, router, register]);

  const inputClass =
    "rounded-lg border-2 border-solid border-white px-6 py-3 placeholder:text-sm placeholder:font-bold placeholder:text-white/55 focus:outline-none text-white bg-transparent text-white lg:w-full ";

  const loginHandler = () => {
    dispatch(loginUser(userInfo));
  };

  return (
    <div className="lg:mx-14 sm:mx-4 sm:flex sm:flex-col sm:rounded-lg sm:border-2 sm:border-white sm:px-2 sm:py-4 md:mx-8 md:py-8">
      <h2 className="mr-6 mb-6 font-bold text-white">
        {register ? "ساخت حساب کاربری" : "        ورود به حساب کاربری :"}
      </h2>
      <div className="sm:flex sm:items-center sm:justify-around">
        <div className="lg:w-1/2">
          <div className="420:mx-16 520:mx-24 620:mx-32 mx-6 flex flex-col items-center justify-center gap-8 rounded-lg border-2 border-solid border-white py-8 sm:mx-6 sm:border-0 sm:py-6">
            {/* user info inputs */}
            <div className="flex w-full max-w-sm flex-col items-center justify-center gap-5 text-center">
              <input
                type="email"
                placeholder="آدرس ایمیل"
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo((info) => ({ ...info, email: e.target.value }))
                }
                className={inputClass}
              />
              <input
                type="password"
                placeholder="رمز عبور"
                value={userInfo.password}
                onChange={(e) =>
                  setUserInfo((info) => ({ ...info, password: e.target.value }))
                }
                className={inputClass}
              />
              <p
                onClick={() => setRegister((register) => !register)}
                className="border-b-2 border-blue-600 pb-1 text-sm font-bold text-blue-500"
              >
                {register
                  ? "حساب دارم ، میخام وارد حساب خودم بشم"
                  : "      حساب ندارم ! میخام ثبت نام کنم"}
              </p>
            </div>
            {/* login button */}
            <button
              disabled={loading || !userInfo.email || !userInfo.password}
              onClick={loginHandler}
              className="rounded-lg bg-white px-8 py-2 font-bold text-black disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <div className="mx-auto w-max">
                  <PulseLoader color="#366de5" margin={5} size={10} />
                </div>
              ) : register ? (
                "ساخت حساب"
              ) : (
                "ورود"
              )}
            </button>
            <Toaster />
          </div>
        </div>
        <Image
          src={"/image/main.jpeg"}
          alt="logo"
          width={500}
          height={500}
          className="hidden w-[18rem] md:w-[20rem] lg:w-[23rem] rounded-lg sm:block"
          priority
        />
      </div>
    </div>
  );
}

export default LoginModal;
