"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUsers } from "@/redux/userSlice";
import { PulseLoader } from "react-spinners";
import { TbReload } from "react-icons/tb";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import { HiUserAdd } from "react-icons/hi";

import CreateUserForm from "../module/CreateUserForm";
import { shortenEmail } from "@/utils/function";

export default function UsersPage() {
  const [isCreateUser, setIsCreateUser] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, page, totalPages } = useSelector(
    (state: RootState) => state.users,
  );

  useEffect(() => {
    dispatch(fetchUsers(page));
  }, [dispatch, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(fetchUsers(newPage));
    }
  };

  const handleRefresh = async () => {
    localStorage.removeItem("users"); // 🧹 پاک کردن کش لوکال
    await dispatch(fetchUsers(page)); // 🔄 گرفتن مجدد از API
    toast.success("بروزرسانی انجام شد"); // ✅ اعلان موفقیت
  };

  return (
    <div className="relative p-6">
      <h1 className="mb-4 text-2xl font-bold text-white">لیست کاربران</h1>

      {/* Refresh Button */}
      <button
        onClick={handleRefresh}
        className="mb-4 flex items-center justify-center gap-3 rounded-lg bg-blue-500 px-3 py-2 font-semibold text-white"
      >
        <span>به روز رسانی </span>
        <TbReload />
      </button>
      <p className="text-sm mb-4 text-red-500">
        با زدن این دکمه کلیه اطلاعات جدید که اضافه شدند ، حذف میشوند
      </p>

      {/* Loading Spinner */}
      {loading && (
        <div className="mx-auto w-max">
          <PulseLoader color="#366de5" margin={8} size={15} />
        </div>
      )}

      {/* Error */}
      {error && <p className="text-red-500">خطا: {error}</p>}

      {/* User Grid */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {users.map((user) => (
          <Link
            key={user.id}
            href={`/users/${user.id}`}
            className="flex items-center justify-between rounded-lg border border-blue-600 p-4 shadow transition hover:shadow-lg"
          >
            <div className="flex flex-col items-start gap-2">
              <h2 className="font-semibold text-white">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-sm font-bold text-gray-400">
                {shortenEmail(user.email)}
              </p>
              <button className="flex items-center gap-1 rounded bg-blue-600 px-3 py-2 text-sm text-white">
                <MdKeyboardDoubleArrowRight className="animate-slide" />
                <span>مشاهده پروفایل</span>
              </button>
            </div>
            <Image
              width={300}
              height={300}
              priority
              src={user.avatar}
              alt={user.first_name}
              className="mb-2 size-24 rounded-full border-[3px] border-blue-600"
            />
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:opacity-50"
        >
          قبلی
        </button>
        <span className="text-white">
          صفحه {page} از {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:opacity-50"
        >
          بعدی
        </button>
      </div>

      {/* Add User Button */}
      <button
        onClick={() => setIsCreateUser(true)}
        className="fixed right-5 bottom-5 rounded-full border-[3px] border-white bg-orange-500 p-3"
      >
        <HiUserAdd className="text-3xl text-white" />
      </button>

      {/* Create User Modal */}
      {isCreateUser && <CreateUserForm setIsCreateUser={setIsCreateUser} />}

      <Toaster />
    </div>
  );
}
