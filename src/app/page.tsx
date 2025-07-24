import Mainpage from "@/components/template/Mainpage";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase.from("todos").select();

  if (error) return <div>خطا در دریافت اطلاعات</div>;

  return <Mainpage />;
}
