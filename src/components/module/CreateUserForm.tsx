"use client";

import { useState, useEffect, useRef } from "react";
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

  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsCreateUser(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // lock scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const [file, setFile] = useState<File | null>(null);
  const [localLoading, setLocalLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.users);

  const supabase = createClient();

  // تابع ذخیره کاربر در localStorage
  const saveUserToLocalStorage = (user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar: string;
  }) => {
    const stored = localStorage.getItem("users");
    let updatedUsers = [];
    if (stored) {
      const parsed = JSON.parse(stored);
      updatedUsers = [user, ...parsed.data];
    } else {
      updatedUsers = [user];
    }
    localStorage.setItem(
      "users",
      JSON.stringify({
        data: updatedUsers,
        page: 1,
        total_pages: 1,
      }),
    );
  };

  const handleCreate = async () => {
    if (localLoading) return; // جلوگیری از کلیک مجدد در حین عملیات

    setLocalLoading(true); // شروع لودینگ
    const id = uuidv4();
    let avatarUrl: string | null = null;

    try {
      if (file) {
        avatarUrl = await uploadAvatar(file, id);
      }
    } catch (error) {
      toast.error("خطا در آپلود آواتار");
      console.log(error);
      setLocalLoading(false); // پایان لودینگ در صورت خطا
      return;
    }

    const newUser = {
      id,
      ...userData,
      avatar:
        avatarUrl ||
        getInitialsAvatarText(userData.first_name, userData.last_name),
    };

    // اول ذخیره در localStorage
    saveUserToLocalStorage(newUser);

    // بعد ذخیره در Supabase
    const { error: dbError } = await supabase.from("users").insert([newUser]);
    if (dbError) {
      toast.error("خطا در ذخیره‌سازی در دیتابیس");
      setLocalLoading(false); // پایان لودینگ در صورت خطا
      return;
    }

    // ذخیره در redux
    const action = await dispatch(createUser(newUser));
    if (createUser.fulfilled.match(action)) {
      toast.success("کاربر با موفقیت ساخته شد 🎉");
      setUserData({ first_name: "", last_name: "", email: "" });
      setFile(null);
      setIsCreateUser(false);
    } else {
      toast.error(action.error?.message || "خطا در ایجاد کاربر");
    }

    setLocalLoading(false); // پایان لودینگ
  };

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const inputClass =
    "rounded-lg border-2 border-white bg-transparent px-6 py-3 text-white placeholder:text-sm placeholder:font-bold placeholder:text-white/55 focus:outline-none";

  const getInitialsAvatarText = (first: string, last: string) => {
    const initials = `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();
    return `👤 ${initials}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="mx-4 w-full max-w-md rounded-lg border-2 border-white bg-[#1a1a1a] p-8"
      >
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
              className="w-full rounded-lg border bg-red-500 px-6 py-2 text-white"
            >
              انصراف
            </button>
            <button
              disabled={
                loading ||
                !userData.first_name ||
                !userData.last_name ||
                !userData.email ||
                !file
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
