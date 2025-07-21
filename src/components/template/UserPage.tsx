"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUsers } from "@/redux/userSlice";
import { FadeLoader } from "react-spinners";
import { TbReload } from "react-icons/tb";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
        onClick={(e) => router.refresh()}
        className="mb-8 flex items-center justify-center gap-3 rounded-lg bg-blue-500 px-3 py-2 font-semibold text-white"
      >
        <span>بروز رسانی</span>
        <span>
          <TbReload />
        </span>
      </button>
      {loading && (
        <div className="mx-auto w-max">
          <FadeLoader color="#1553da" height={25} width={7} />
        </div>
      )}
      {error && <p className="text-red-500">خطا: {error}</p>}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {users.map((user) => (
          <Link
            href={`/users/${user.id}`}
            key={user.id}
            className="flex items-center justify-between rounded-lg border border-white p-4 shadow transition hover:shadow-lg"
          >
            <div>
              <h2 className="font-semibold text-white">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-sm font-bold text-gray-500">{user.email}</p>
            </div>
            <Image
              width={300}
              height={300}
              priority
              src={user.avatar}
              alt={user.first_name}
              className="mb-2 size-24 rounded-full"
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
    </div>
  );
}
