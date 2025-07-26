import React from "react";
import chatRoom from "@/constant/chatroom";
import Link from "next/link";
function Footer() {
  return (
    <div className="mx-2 mt-8 flex flex-col gap-4 items-center justify-between rounded-lg bg-blue-600 py-3 sm:flex-row sm:px-4 md:mx-8  ">
      <p className="text-white md:text-sm  text-xs  font-bold">این تسک توسط مهدی خلیلی توسعه داده شده است .</p>
      <div className="flex gap-3 items-center" >
        {chatRoom.map((item, index) => (
          <Link key={index} href={item.link}>
            {item.icon}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Footer;
