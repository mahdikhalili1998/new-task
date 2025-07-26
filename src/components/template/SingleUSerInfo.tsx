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
import { updateUser, deleteUser } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import { TiArrowBack } from "react-icons/ti";

function SingleUserInfo({ id }: ID) {
  const [info, setInfo] = useState<ISingleUserInfo | null>(null);

  const [isDelete, setIsDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.users);

  const inputClass =
    "rounded border-2 border-blue-600 bg-transparent p-1 text-white placeholder:text-white/45 placeholder:text-sm focus:outline-none px-3";

  useEffect(() => {
   
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
          return; 
        }
      } catch (error) {
        console.error("خطا در خواندن localStorage", error);
      }
    }

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


          const stored = localStorage.getItem("users");
          let currentUsers = [];
          if (stored) {
            try {
              currentUsers = JSON.parse(stored).data || [];
            } catch {}
          }

          const existingUserIndex = currentUsers.findIndex(
            (u) => u.id === response.data.data.id,
          );
          if (existingUserIndex >= 0) {
            currentUsers[existingUserIndex] = response.data.data;
          } else {
            currentUsers.push(response.data.data);
          }

          localStorage.setItem("users", JSON.stringify({ data: currentUsers }));
        }
      } catch (error) {
        console.error("خطا در دریافت از API", error);
      }
    };

    fetchUser();
  }, [id]);

  const handleUpdate = async () => {
    if (!info) return;

    try {
      await dispatch(updateUser({ id: info.id, data: formData })).unwrap();

      const updatedUserData = { ...info, ...formData };
      setIsEditing(false);
      setInfo(updatedUserData);

      const stored = localStorage.getItem("users");
      if (stored) {
        const parsed = JSON.parse(stored);
        const updatedUsers = parsed.data.map((user: ISingleUserInfo) =>
          user.id === info.id ? updatedUserData : user,
        );
        localStorage.setItem(
          "users",
          JSON.stringify({ ...parsed, data: updatedUsers }),
        );
      } else {
        localStorage.setItem(
          "users",
          JSON.stringify({ data: [updatedUserData] }),
        );
      }
    } catch (error) {
      console.error("خطا در آپدیت کاربر", error);
    }
  };

  const handleDelete = async () => {
    if (!info) return;

    try {
      await dispatch(deleteUser(info.id)).unwrap();

      const stored = localStorage.getItem("users");
      if (stored) {
        const parsed = JSON.parse(stored);
        const updatedUsers = parsed.data.filter(
          (user: ISingleUserInfo) => user.id !== info.id,
        );
        localStorage.setItem(
          "users",
          JSON.stringify({ ...parsed, data: updatedUsers }),
        );
      }

      router.push("/users");
    } catch (error) {
      console.error("خطا در حذف کاربر", error);
    }
  };

  if (!info)
    return (
      <div className="mx-auto w-max">
        <PulseLoader color="#366de5" margin={8} size={15} />
      </div>
    );

  return (
    <div className="relative">
      <div className="mx-auto flex w-max flex-col items-center justify-center gap-8">
        {/* User avatar */}
        <Image
          width={300}
          height={300}
          priority
          src={info.avatar}
          alt="avatar"
          className="size-32 rounded-full border-2 border-blue-600 sm:size-40"
        />
        {/* User details */}
        <div className="flex flex-col items-end justify-center gap-4">
          <h2 className="flex items-center gap-2 font-semibold text-white">
            <span className="pt-2">
              {info.first_name} {info.last_name}
            </span>
            <IoIosPerson className="text-2xl text-blue-600" />
          </h2>
          <p className="flex items-center gap-2 font-semibold text-white">
            <span>{info.email}</span>
            <MdEmail className="text-2xl text-blue-600" />
          </p>
        </div>
        {/* Action buttons */}
        <ul className="mt-4 flex items-center justify-between gap-4">
          <li onClick={() => setIsDelete(true)} className="cursor-pointer">
            <MdDeleteForever className="text-3xl text-red-500" />
          </li>
          <li onClick={() => setIsEditing(true)} className="cursor-pointer">
            <RiEdit2Fill className="text-3xl text-blue-600" />
          </li>
          <li onClick={() => router.back()} className="cursor-pointer">
            <TiArrowBack className="text-3xl text-white" />
          </li>
        </ul>
      </div>

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
                  <PulseLoader color="#fff" margin={5} size={10} />
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

      {isEditing && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
          className="420:mx-10 520:mx-20 mx-6 my-4 flex flex-col gap-4 sm:mx-auto sm:my-7 sm:w-1/2"
        >
          <h2 className="my-3 text-sm font-bold text-white">
            ویرایش فیلد های مورد نظر :
          </h2>
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
          <div className="flex flex-col gap-1">
            <label className="text-white" htmlFor="lastName">
              نام خانوادگی :
            </label>
            <input
              id="lastName"
              type="text"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              placeholder="نام خانوادگی جدید را وارد کنید"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-white" htmlFor="email">
              ایمیل :
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="ایمیل جدید را وارد کنید"
              className={inputClass}
            />
          </div>
          <div className="mt-4 flex justify-between gap-5">
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 rounded bg-blue-600 py-2 text-white disabled:opacity-50"
            >
              {loading ? (
                <PulseLoader color="#fff" margin={5} size={10} />
              ) : (
                "ذخیره تغییرات"
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="w-1/2 rounded border bg-red-500  py-2 text-white"
            >
              انصراف
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default SingleUserInfo;
