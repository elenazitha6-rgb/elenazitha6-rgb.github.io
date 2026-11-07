import { LOCALE_META, type Locale } from "./config";

/** 日期按各语言习惯显示,如 `November 6, 2026`、`2026年11月6日`、`۱۵ آبان ۱۴۰۵`。固定用 UTC,构建机器时区不影响结果。 */
export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(LOCALE_META[locale].dateLocale, { dateStyle: "long", timeZone: "UTC" }).format(date);
}

/** `<time datetime>` 用的 ISO 日期(YYYY-MM-DD)。 */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
