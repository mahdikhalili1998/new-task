"use client";
import { ID } from "@/types/ComponentsProps";
import { PulseLoader } from "react-spinners";
import React, { useEffect, useState } from "react";
import { ISingleUserInfo } from "@/types/StateTypes";
import axiosClient from "@/utils/axiosClient";
import { IoIosPerson } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { RiEdit2Fill } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { updateUser } from "@/redux/userSlice";
import { deleteUser } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import { TiArrowBack } from "react-icons/ti";

function SingleUSerInfo({ id }: ID) {
  const [info, setInfo] = useState<ISingleUserInfo>({
    avatar: "",
    email: "",
    first_name: "",
    last_name: "",
    id: 1,
  });
  console.log(info);

  const [isDelete, setIsDelete] = useState<boolean>(false);

  //   for editing
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: info.first_name,
    last_name: info.last_name,
    email: info.email,
  });

  const router = useRouter();

  const inputClass =
    "rounded border-2 border-blue-600 bg-transparent p-1 text-white placeholder:text-white/45 placeholder:text-sm focus:outline-none px-3";

  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.users);

  //   getting user info by id
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosClient.get(`/users/${id}`);
        if (response.status === 200) {
          setInfo(response.data.data);
          setFormData({
            first_name: response.data.data.first_name,
            last_name: response.data.data.last_name,
            email: response.data.data.email,
          });
        }
      } catch (error) {
        console.warn("⛔ خطا در دریافت از API. بررسی localStorage...");

        const stored = localStorage.getItem("users");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            const found = parsed.data.find(
              (user: ISingleUserInfo) => String(user.id) === String(id),
            );
            if (found) {
              setInfo(found);
              setFormData({
                first_name: found.first_name,
                last_name: found.last_name,
                email: found.email,
              });
            } else {
              console.error("کاربر با این ID در localStorage یافت نشد");
            }
          } catch (err) {
            console.error("خطا در پارس کردن localStorage", err);
          }
        } else {
          console.error("هیچ دیتایی در localStorage موجود نیست");
        }
      }
    };

    fetchUser();
  }, [id]);

  // update user
  const handleUpdate = async () => {
    try {
      await dispatch(updateUser({ id: info.id, data: formData })).unwrap();

      // فرم را ببند و state را آپدیت کن
      setIsEditing(false);
      setInfo((prev) => ({ ...prev, ...formData }));

      // ✅ update localStorage if exists
      const stored = localStorage.getItem("users");
      if (stored) {
        const parsed = JSON.parse(stored);
        const updatedUsers = parsed.data.map((user: ISingleUserInfo) =>
          user.id === info.id ? { ...user, ...formData } : user,
        );

        const updatedStorage = {
          ...parsed,
          data: updatedUsers,
        };

        localStorage.setItem("users", JSON.stringify(updatedStorage));
      }
    } catch (err) {
      console.error("خطا در آپدیت کاربر:", err);
    }
  };

  // delete user

  // delete user
  const handleDelete = async () => {
    try {
      await dispatch(deleteUser(info.id)).unwrap();

      // ✅ حذف از localStorage
      const stored = localStorage.getItem("users");
      if (stored) {
        const parsed = JSON.parse(stored);
        const updatedUsers = parsed.data.filter(
          (user: ISingleUserInfo) => user.id !== info.id,
        );

        const updatedStorage = {
          ...parsed,
          data: updatedUsers,
        };

        localStorage.setItem("users", JSON.stringify(updatedStorage));
      }

      router.push("/users"); // مسیر دلخواه بعد از حذف
    } catch (err) {
      console.error("خطا در حذف کاربر:", err);
    }
  };

  return (
    <>
      {!info.avatar ? (
        <div className="mx-auto w-max">
          <PulseLoader color="#366de5" margin={8} size={15} />
        </div>
      ) : (
        <div className="relative">
          <div className="mx-auto flex w-max flex-col items-center justify-center gap-8">
            <Image
              width={300}
              height={300}
              priority
              src={info.avatar}
              alt="avatar"
              className="size-32 rounded-full border-2 border-blue-600"
            />
            {/* detail box */}
            <div className="flex flex-col items-end justify-center gap-4">
              {/* name & lastName */}
              <h2 className="flex items-center gap-2 font-semibold text-white">
                <span className="pt-2">
                  {info.first_name} {info.last_name}
                </span>
                <IoIosPerson className="text-2xl text-blue-600" />
              </h2>
              {/* email */}
              <p className="flex items-center gap-2 font-semibold text-white">
                <span> {info.email}</span>
                <MdEmail className="text-2xl text-blue-600" />
              </p>
            </div>
            {/* edit & delete box  */}
            <ul className="mt-4 flex items-center justify-between gap-4">
              <li onClick={() => setIsDelete(true)}>
                <MdDeleteForever className="text-3xl text-red-500" />
              </li>
              <li onClick={() => setIsEditing(true)}>
                <RiEdit2Fill className="text-3xl text-blue-600" />
              </li>
              <li onClick={() => router.back()}>
                <TiArrowBack className="text-3xl text-white" />
              </li>
            </ul>
          </div>
          {/* for deleting */}
          {isDelete && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
              <div className="mx-5 flex flex-col items-center justify-center gap-4 rounded bg-[#3b116d] p-4 shadow-lg shadow-blue-600/85">
                <h2 className="text-sm text-white">
                  آیا میخواهید کاربر را حذف کنید ؟؟
                </h2>
                <div className="flex w-full items-center justify-center gap-6">
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="w-1/2 rounded bg-red-500 py-2 text-white disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="mx-auto w-max">
                        <PulseLoader color="#fff" margin={5} size={10} />
                      </div>
                    ) : (
                      "حذف"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDelete(false)}
                    className="w-1/2 rounded bg-blue-600 py-2 text-white"
                  >
                    انصراف
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* for editing */}
          {isEditing ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate();
              }}
              className="mx-6 my-4 flex flex-col gap-4"
            >
              <h2 className="my-3 text-sm font-bold text-white">
                ویرایش فیلد های مورد نظر :
              </h2>
              {/* name  */}
              <div className="flex flex-col gap-1">
                <label className="text-white" htmlFor="name">
                  نام :
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  placeholder="نام جدید را وارد کنید "
                  className={inputClass}
                />
              </div>
              {/* lastName */}
              <div className="flex flex-col gap-1">
                <label className="text-white" htmlFor="lastName">
                  نام خانوادگی :
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  placeholder="نام خانوادگی جدید را وارد کنید"
                  className={inputClass}
                />
              </div>
              {/* email */}
              <div className="flex flex-col gap-1">
                <label className="text-white" htmlFor="email">
                  ایمیل :
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="ایمیل جدید را وارد کنید"
                  className={inputClass}
                />
              </div>
              {/* action buttons  */}
              <div className="flex w-full items-center justify-center gap-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-1/2 rounded bg-blue-600 py-2 text-white disabled:opacity-50"
                >
                  {loading ? (
                    <div className="mx-auto w-max">
                      <PulseLoader color="#fff" margin={5} size={10} />
                    </div>
                  ) : (
                    "ذخیره "
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="w-1/2 rounded bg-red-500 py-2 text-white"
                >
                  انصراف
                </button>
              </div>
            </form>
          ) : null}
        </div>
      )}
    </>
  );
}

export default SingleUSerInfo;
