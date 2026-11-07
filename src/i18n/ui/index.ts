import type { Locale } from "../config";
import { en } from "./en";
import { fa } from "./fa";
import { ja } from "./ja";
import { ru } from "./ru";
import { tr } from "./tr";
import { zh } from "./zh";
import { zhHant } from "./zh-Hant";

/** 把字符串字面量放宽成 string,函数和数组保持原样。 */
type Widen<T> = T extends string ? string : T extends (...args: never[]) => unknown ? T : T extends readonly unknown[] ? string[] : { [K in keyof T]: Widen<T[K]> };

/** 界面文案的形状:以英文为准,其它语言少一个 key、多一个 key 都编译不过。 */
export type Messages = Widen<typeof en>;

const MESSAGES: Record<Locale, Messages> = {
  en,
  zh,
  "zh-Hant": zhHant,
  ja,
  ru,
  fa,
  tr,
};

export function getMessages(locale: Locale): Messages {
  return MESSAGES[locale];
}
