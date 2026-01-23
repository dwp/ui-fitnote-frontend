import { field, validators as r } from "@dwp/govuk-casa";

export default () => [
  field("esa").validators([
    r.required.make({
      errorMsg: "esa:field.esa.empty",
    }),
    r.inArray.make({
      source: ["yes", "no"],
      errorMsg: "esa:field.esa.empty",
    }),
  ]),
];
