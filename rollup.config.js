import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-legacy";
import legacy from "@rollup/plugin-legacy";
import { babel } from "@rollup/plugin-babel";
import alias from "@rollup/plugin-alias";

const plugins = [
  alias({
    entries: [
      {
        // Dedupe NodeList.forEach() included in both hmrc-frontend and
        // govuk-frontend
        find: /.*common$/,
        replacement: "govuk-frontend/govuk-esm/common.mjs",
      },
      {
        find: /.*defineProperty$/,
        replacement:
          "govuk-frontend/govuk/vendor/polyfills/Object/defineProperty.js",
      },
      {
        find: /.*bind$/,
        replacement:
          "govuk-frontend/govuk/vendor/polyfills/Function/prototype/bind.js",
      },
    ],
  }),
  legacy({}),
  nodeResolve(),
  // HMRC use ES6 js in their TimeoutDialog code, so we need to babel it out
  babel({
    babelHelpers: "bundled",
    presets: ["@babel/preset-env"],
    include: ["node_modules/hmrc-frontend/**/*"],
  }),
  terser({ ie8: true }),
];

const createConfig = (file, outputFile) => ({
  input: `${file}`,
  output: [
    {
      file: `assets/js/${outputFile}`,
      format: "umd",
      name: "GOVUKFrontend",
    },
  ],
  plugins,
});

export default [createConfig("assets/js/all.js", "ui-fitnote-frontend.js")];
