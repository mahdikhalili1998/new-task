function shortenEmail(text: string, maxLength = 17): string {
  if (text.length <= maxLength) return text;
  return "…" + text.slice(0, maxLength); // نقطه‌چین فارسی
}



export { shortenEmail };
