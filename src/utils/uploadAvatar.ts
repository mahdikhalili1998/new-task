import { createClient } from "./supabase/client";

export const uploadAvatar = async (
  file: File,
  userId: string,
): Promise<string> => {
  const supabase = createClient();

  const fileExt = file.name.split(".").pop();
  const filePath = `profile/${userId}.${fileExt}`;

  // 1. Upload to Supabase storage
  const { error: uploadError } = await supabase.storage
    .from("profile") // ✅ باید bucket name باشه (توی Supabase ساخته شده باشه)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true, // اگر فایل قبلاً وجود داشت، جایگزین کن
    });

  if (uploadError) {
    throw new Error("خطا در آپلود فایل: " + uploadError.message);
  }

  // 2. دریافت public URL
  const { data } = supabase.storage.from("profile").getPublicUrl(filePath);

  if (!data?.publicUrl) {
    throw new Error("خطا در دریافت لینک تصویر");
  }

  return data.publicUrl;
};
