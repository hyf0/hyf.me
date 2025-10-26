import { postcssIsolateStyles } from "vitepress";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

export default {
  plugins: [
    tailwindcss,
    autoprefixer,
    postcssIsolateStyles({
      includeFiles: [/vp-doc\.css/, /base\.css/],
    }),
  ],
};
