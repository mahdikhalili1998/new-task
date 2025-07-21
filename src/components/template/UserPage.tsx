"use client";

import { useEffect } from "react";
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

export default function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, page, totalPages } = useSelector(
    (state: RootState) => state.users,
  );

  const router = useRouter();

  useEffect(() => {
    dispatch(fetchUsers(page));
  }, [dispatch, page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(fetchUsers(newPage));
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold text-white">لیست کاربران</h1>
      <button
        onClick={(e) => {
          router.refresh();
          toast.success("بروز رسانی انجام شد");
        }}
        className="mb-8 flex items-center justify-center gap-3 rounded-lg bg-blue-500 px-3 py-2 font-semibold text-white"
      >
        <span>بروز رسانی</span>
        <span>
          <TbReload />
        </span>
      </button>
      {loading && (
        <div className="mx-auto w-max">
          <PulseLoader color="#366de5" margin={8} size={15} />
        </div>
      )}
      {error && <p className="text-red-500">خطا: {error}</p>}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {users.map((user) => (
          <Link
            href={`/users/${user.id}`}
            key={user.id}
            className="flex items-center justify-between rounded-lg border border-blue-600 p-4 shadow transition hover:shadow-lg"
          >
            <div className="flex flex-col items-start gap-2">
              <h2 className="font-semibold text-white">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-sm font-bold text-gray-500">{user.email}</p>
              <button className="flex items-center gap-1 rounded bg-blue-600 px-3 py-2 text-sm text-white">
                <MdKeyboardDoubleArrowRight className="animate-slide" />
                <span> مشاهده پروفایل</span>
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

      <div className="flex items-center justify-center gap-4">
        <button
          className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
        >
          بعدی
        </button>
        <span className="text-white">
          صفحه {page} از {totalPages}
        </span>
        <button
          className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          قبلی
        </button>
      </div>
      <Toaster />
    </div>
  );
}
