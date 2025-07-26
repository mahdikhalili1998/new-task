"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUsers } from "@/redux/userSlice";
import { PulseLoader } from "react-spinners";
import { TbReload } from "react-icons/tb";

import Link from "next/link";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import toast, { Toaster } from "react-hot-toast";
import { HiUserAdd } from "react-icons/hi";

import CreateUserForm from "../module/CreateUserForm";
import { shortenEmail } from "@/utils/function";
import { useRouter } from "next/navigation";
import UserAvatar from "../module/UserAvatar";

export default function UsersPage() {
  const [isCreateUser, setIsCreateUser] = useState(false);
  const [isrefresh, setIsRefresh] = useState<boolean>(false);

  const [showButton, setShowButton] = useState(true);
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setShowButton(false);
      } else {
        setShowButton(true);
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // for image after edit user info
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
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
    setIsRefresh(false);
    router.refresh();
  };

  return (
    <div className="relative p-6">
      <h1 className="mb-4 text-2xl font-bold text-white">لیست کاربران</h1>
      {/* Refresh Button */}
      <button
        onClick={() => setIsRefresh(true)}
        className="mb-4 flex items-center justify-center gap-3 rounded-lg bg-blue-500 px-3 py-2 font-semibold text-white"
      >
        <span>به روز رسانی </span>
        <TbReload />
      </button>
      {isrefresh && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="mx-5 flex flex-col items-center justify-center gap-4 rounded bg-[#3b116d] p-4 shadow-lg shadow-blue-600/85">
            <h2 className="text-sm text-white">
              با این کار تمام اطلاعات جدید که ثبت شدند حذف میگردند ، ادامه
              میدهید؟
            </h2>
            <div className="flex w-full items-center justify-center gap-6">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="w-1/2 rounded bg-red-500 py-2 text-white disabled:opacity-50"
              >
                {loading ? (
                  <div className="mx-auto w-max">
                    <PulseLoader color="#fff" margin={5} size={10} />
                  </div>
                ) : (
                  "ادامه"
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsRefresh(false)}
                className="w-1/2 rounded bg-blue-600 py-2 text-white"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Loading Spinner */}
      {loading && (
        <div className="mx-auto w-max">
          <PulseLoader color="#366de5" margin={8} size={15} />
        </div>
      )}

      {/* User Grid */}
      <div className="col-b3 grid-cols-3-920 mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {users.map((user) => (
          <Link
            key={user.id}
            href={`/users/${user.id}`}
            className="420:px-6 520:mx-6 flex items-center justify-between rounded-lg border border-blue-600 p-4 shadow transition hover:shadow-lg sm:mx-0"
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

            <UserAvatar src={user.avatar} alt="user name" userId={user.id} />
          </Link>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:opacity-50"
        >
          بعدی
        </button>

        <span className="text-white">
          صفحه {page} از {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300 disabled:opacity-50"
        >
          قبلی
        </button>
      </div>
      {/* Add User Button */}
      <button
        onClick={() => setIsCreateUser(true)}
        className={`fixed right-5 bottom-5 z-50 rounded-full border-[3px] border-white bg-orange-500 p-3 shadow-lg transition-all duration-300 ${
          showButton
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-10 opacity-0"
        }`}
      >
        <HiUserAdd className="text-3xl text-white" />
      </button>

      {/* Create User Modal */}
      {isCreateUser && <CreateUserForm setIsCreateUser={setIsCreateUser} />}
      <Toaster />
    </div>
  );
}
