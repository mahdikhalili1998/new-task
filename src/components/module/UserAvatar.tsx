"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { PulseLoader } from "react-spinners";

type Props = {
  src?: string;
  alt: string;
  userId: string | number;
};

export default function UserAvatar({ src, alt, userId }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [validSrc, setValidSrc] = useState<string | null>(null);
  const [retryAttempted, setRetryAttempted] = useState(false);

  useEffect(() => {
    if (src && src.trim() !== "") {
      // اگر src مستقیم از props معتبر بود، استفاده کن
      setValidSrc(src);
      setError(false);
      setLoaded(false);
      setRetryAttempted(false);
    } else {
      setValidSrc(null);
      setError(true);
    }
  }, [src]);

  // اگر خطا رخ داد، از localStorage دوباره تلاش کن
  useEffect(() => {
    if (error && !retryAttempted) {
      try {
        const usersJSON = localStorage.getItem("users");
        if (usersJSON) {
          const usersData = JSON.parse(usersJSON);

          if (usersData && Array.isArray(usersData.data)) {
            // جستجو با تبدیل id ها به رشته برای تطبیق دقیق
            const user = usersData.data.find(
              (u: any) => String(u.id) === String(userId),
            );

            if (user && user.avatar && user.avatar.trim() !== "") {
              setValidSrc(user.avatar);
              setError(false);
              setLoaded(false);
            } else {
              setValidSrc(null);
            }
          }
        }
      } catch (e) {
        setValidSrc(null);
      }
      setRetryAttempted(true);
    }
  }, [error, retryAttempted, userId]);

  return (
    <>
      {/* اگر تصویر لود نشده یا خطا داشت → لودینگ نشون بده */}
      {(!loaded || error) && (
        <div className="mb-2 flex size-24 items-center justify-center rounded-full border-[3px] border-blue-600">
          <PulseLoader color="#366de5" size={8} />
        </div>
      )}

      {/* اگر مسیر معتبر و بدون خطا بود → عکس رو نشون بده */}
      {validSrc && !error && (
        <Image
          width={300}
          height={300}
          src={validSrc}
          alt={alt}
          priority
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`mb-2 size-24 420:size-32 sm:size-24 820:size-28 rounded-full border-[3px] border-blue-600 ${
            !loaded ? "hidden" : ""
          }`}
        />
      )}
    </>
  );
}
