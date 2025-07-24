"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { createUser } from "@/redux/userSlice";
import toast, { Toaster } from "react-hot-toast";
import { PulseLoader } from "react-spinners";
import { ICreateUser } from "@/types/ComponentsProps";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/utils/supabase/client";
import { uploadAvatar } from "@/utils/uploadAvatar";

function CreateUserForm({ setIsCreateUser }: ICreateUser) {
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const [file, setFile] = useState<File | null>(null);

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.users);

  const supabase = createClient();

  const handleCreate = async () => {
    const id = uuidv4();
    let avatarUrl: string | null = null;

    try {
      if (file) {
        avatarUrl = await uploadAvatar(file, id);
      }
    } catch (err) {
      toast.error("خطا در آپلود آواتار");
      return;
    }

    const newUser = {
      id,
      ...userData,
      avatar:
        avatarUrl ||
        getInitialsAvatarText(userData.first_name, userData.last_name),
    };

    // ذخیره در Supabase
    const { error: dbError } = await supabase.from("users").insert([newUser]);
    if (dbError) {
      toast.error("خطا در ذخیره‌سازی در دیتابیس");
      return;
    }

    // ذخیره در redux
    const action = await dispatch(createUser(newUser));
    if (createUser.fulfilled.match(action)) {
      const stored = localStorage.getItem("users");
      let updatedUsers = [];

      if (stored) {
        const parsed = JSON.parse(stored);
        updatedUsers = [action.payload, ...parsed.data]; // اضافه به اول لیست
      } else {
        updatedUsers = [action.payload];
      }
      localStorage.setItem(
        "users",
        JSON.stringify({
          data: updatedUsers,
          page: 1,
          total_pages: 1,
        }),
      );
      toast.success("کاربر با موفقیت ساخته شد 🎉");
      setUserData({ first_name: "", last_name: "", email: "" });
      setFile(null);
      setIsCreateUser(false);
    } else {
      toast.error(action.error?.message || "خطا در ایجاد کاربر");
    }
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const inputClass =
    "rounded-lg border-2 border-white bg-transparent px-6 py-3 text-white placeholder:text-sm placeholder:font-bold placeholder:text-white/55 focus:outline-none";

  // 👇 فقط یه متن بساز، چون آواتار باید string باشه
  const getInitialsAvatarText = (first: string, last: string) => {
    const initials = `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
    return `👤 ${initials}`; // یا فقط initials
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border-2 border-white bg-[#1a1a1a] p-8">
        <h2 className="mb-6 text-center font-bold text-white">
          ایجاد کاربر جدید
        </h2>

        <div className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="نام"
            value={userData.first_name}
            onChange={(e) =>
              setUserData({ ...userData, first_name: e.target.value })
            }
            className={inputClass}
          />
          <input
            type="text"
            placeholder="نام خانوادگی"
            value={userData.last_name}
            onChange={(e) =>
              setUserData({ ...userData, last_name: e.target.value })
            }
            className={inputClass}
          />
          <input
            type="email"
            placeholder="ایمیل"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            className={inputClass}
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0] ?? null;
              setFile(selectedFile);
            }}
            className="text-white file:mr-4 file:rounded-md file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
          />

          <div className="mt-4 flex items-center justify-between gap-4">
            <button
              onClick={() => setIsCreateUser(false)}
              className="w-full rounded-lg border border-white bg-transparent px-6 py-2 text-white"
            >
              انصراف
            </button>
            <button
              disabled={
                loading ||
                !userData.first_name ||
                !userData.last_name ||
                !userData.email
              }
              onClick={handleCreate}
              className="w-full rounded-lg bg-white px-6 py-2 font-bold text-black disabled:opacity-60"
            >
              {loading ? (
                <PulseLoader color="#366de5" margin={3} size={8} />
              ) : (
                "ایجاد کاربر"
              )}
            </button>
          </div>
        </div>
        <Toaster />
      </div>
    </div>
  );
}

export default CreateUserForm;
