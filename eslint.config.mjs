import { FlatCompat } from "@eslint/eslintrc";
import { globalIgnores } from "eslint/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: currentDirectory });

const config = [
  globalIgnores([".next/**", "node_modules/**", "coverage/**", "next-env.d.ts"]),
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default config;
