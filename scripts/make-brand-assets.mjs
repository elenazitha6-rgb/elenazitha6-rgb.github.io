// 一次性脚本:从官网 logo(256px PNG)生成博客用的小尺寸图标。
// 用法:node scripts/make-brand-assets.mjs(sharp 随 astro 一起装好了)。产物已提交,日常不需要重跑。
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "public/brand/anbo-logo-256.png");

// 页头 Logo 显示 32px,出 2x / 3x 清晰图(webp 比 105 KB 的原图小两个数量级)。
for (const size of [64, 96]) {
  await sharp(src).resize(size, size).webp({ quality: 90 }).toFile(path.join(root, `public/brand/logo-${size}.webp`));
}
await sharp(src).resize(32, 32).png().toFile(path.join(root, "public/icon-32.png"));
console.log("ok");
