"use client";

import { TProps } from "@/types/ComponentsProps";
import Image from "next/image";
import { useState, useEffect } from "react";
import { PulseLoader } from "react-spinners";

export default function UserAvatar({ src, alt, userId }: TProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [validSrc, setValidSrc] = useState<string | null>(null);
  const [retryAttempted, setRetryAttempted] = useState(false);

  // Set initial image
  useEffect(() => {
    if (src && src.trim() !== "") {
      setValidSrc(src);
      setError(false);
      setLoaded(false);
      setRetryAttempted(false);
    } else {
      setValidSrc(null);
      setError(true);
    }
  }, [src]);

  // Retry with avatar from localStorage
  useEffect(() => {
    if (error && !retryAttempted) {
      try {
        const usersJSON = localStorage.getItem("users");
        if (usersJSON) {
          const usersData = JSON.parse(usersJSON);
          if (Array.isArray(usersData?.data)) {
            const user = usersData.data.find(
              (u) => String(u.id) === String(userId),
            );
            if (user?.avatar?.trim()) {
              setValidSrc(user.avatar);
              setError(false);
              setLoaded(false);
            } else {
              setValidSrc(null);
            }
          }
        }
      } catch {
        setValidSrc(null);
      }
      setRetryAttempted(true);
    }
  }, [error, retryAttempted, userId]);

  return (
    <>
      {/* Show loader while image is loading or errored */}
      {(!loaded || error) && (
        <div className="mb-2 flex size-24 items-center justify-center rounded-full border-[3px] border-blue-600">
          <PulseLoader color="#366de5" size={8} />
        </div>
      )}

      {/* Show valid image after load */}
      {validSrc && !error && (
        <Image
          width={300}
          height={300}
          src={validSrc}
          alt={alt}
          priority
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`420:size-32 820:size-28 mb-2 size-24 rounded-full border-[3px] border-blue-600 sm:size-24 ${
            !loaded ? "hidden" : ""
          }`}
        />
      )}
    </>
  );
}
