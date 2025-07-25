import React from "react";
import LoginModal from "../module/LoginModal";
import Image from "next/image";
import Link from "next/link";

function Mainpage() {
  return (
    <div>
      <Image
        src={"/image/main.jpeg"}
        alt="omid-faza"
        width={300}
        height={300}
        priority
        className="mx-auto w-[18rem] rounded-lg"
      />
      <div className="my-4 px-6 text-white">
        <h3 className="mb-2 text-lg font-bold"> نکته مهم درباره API</h3>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed">
          <li>
            این برنامه به منظور نمایش قابلیت‌ها و تست رابط کاربری، به API عمومی
            و تستی&nbsp;
            <a
              href="https://reqres.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              reqres.in
            </a>
            &nbsp;متصل است.
          </li>
          <li>
            تنها تعداد محدودی <strong>حساب کاربری از پیش تعریف‌شده</strong> توسط
            این API پشتیبانی می‌شوند.
          </li>
          <li>
            بنابراین، امکان ورود یا ثبت‌نام با ایمیل دلخواه وجود ندارد و فقط با
            ایمیل‌های مشخص از مستندات reqres.in قابل انجام است.
          </li>
          <li>
            هیچ داده واقعی ذخیره یا پردازش نمی‌شود؛ بنابراین برای هندل کردن این
            موضوع اطلاعات بعد از لود شدن در حافظه محلی مرورگر جهت اعمال تغیرات
            ذخیره میشوند
          </li>
        </ul>
      </div>
      <div className="my-3 flex items-center justify-center gap-5">
        <Link
          className="rounded-lg bg-blue-600 px-3 py-2 font-bold text-white"
          href={"/login"}
        >
          ثبت نام / ورود
        </Link>
        <Link
          className="my-3 rounded-lg border-2 border-white bg-transparent px-2 py-2 text-white"
          href={"/users"}
        >
          لیست کاربران
        </Link>
      </div>
    </div>
  );
}

export default Mainpage;
