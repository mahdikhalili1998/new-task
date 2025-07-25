"use client";
import { useEffect, useRef } from "react";
import Typed from "typed.js";

function TextDemo() {
  const el = useRef(null);

  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [" سازمان گروه نوآور امید فضا", "تسک پنل مدیریت کاربران"],
      typeSpeed: 60,
      backSpeed: 60,
      backDelay: 1000,
      loop: true,
      showCursor: true,
      cursorChar: "|", 
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="mb-14 flex min-h-[2.5rem] justify-center rounded-b-[85%] bg-slate-200 px-3 pt-8 pb-10 text-xl font-semibold shadow-lg/65 shadow-blue-600">
      <span ref={el} />
    </div>
  );
}

export default TextDemo;
