import { field, validators as r } from "@dwp/govuk-casa";

export default () => [
  field("methodObtained").validators([
    r.required.make({
      errorMsg: "method-obtained:field.methodObtained.empty",
    }),
    r.inArray.make({
      source: ["paper", "digital"],
      errorMsg: "method-obtained:field.methodObtained.empty",
    }),
  ]),
];
