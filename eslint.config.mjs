import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * `package.json` declared a `lint` script and the source carries
 * `eslint-disable-next-line @next/next/no-img-element` comments, but no
 * flat config existed — so `npm run lint` failed outright on ESLint 9.
 *
 * eslint-config-next 16 ships flat configs directly; FlatCompat is not
 * needed (and in fact blows up on this version).
 */
const eslintConfig = [
  { ignores: [".next/**", "node_modules/**", "out/**", "build/**"] },
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default eslintConfig;
