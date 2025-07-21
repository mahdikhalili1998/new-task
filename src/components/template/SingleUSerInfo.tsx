"use client";
import { ID } from "@/types/ComponentsProps";
import { PulseLoader } from "react-spinners";
import React, { useEffect, useState } from "react";
import { ISingleUserInfo } from "@/types/StateTypes";
import axiosClient from "@/utils/axiosClient";
import { IoIosPerson } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import Image from "next/image";

function SingleUSerInfo({ id }: ID) {
  const [info, setInfo] = useState<ISingleUserInfo>({
    avatar: "",
    email: "",
    first_name: "",
    last_name: "",
    id: 1,
  });

  //   getting user info by id
  useEffect(() => {
    try {
      const fetchUser = async () => {
        const response = await axiosClient.get(`/users/${id}`);
        if (response.status === 200) {
          setInfo({ ...response.data.data });
        }
      };
      fetchUser();
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      {!info.avatar ? (
        <div className="mx-auto w-max">
          <PulseLoader color="#366de5" margin={8} size={15} />
        </div>
      ) : (
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
        </div>
      )}
    </>
  );
}

export default SingleUSerInfo;
