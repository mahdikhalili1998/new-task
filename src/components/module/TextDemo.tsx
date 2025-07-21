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
      cursorChar: "|", // می‌تونی این علامت رو تغییر بدی مثلا "_"
    });

    return () => {
      typed.destroy();
    };
  }, []);

  return (
    <div className="flex min-h-[2.5rem] justify-center rounded-b-[85%] bg-slate-200 px-3 pt-8 pb-10 text-xl font-semibold mb-14">
      <span ref={el} />
    </div>
  );
}

export default TextDemo;
