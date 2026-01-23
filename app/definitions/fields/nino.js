import { field, validators as r } from "@dwp/govuk-casa";

export default () => [
  field("nino").validators([
    r.required.make({
      errorMsg: "nino:field.nino.empty",
    }),
    r.regex.make({
      pattern:
        /^(?!BG|GB|NK|KN|TN|NT|ZZ)[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-D]{1}$/,
      errorMsg: "nino:field.nino.format",
    }),
  ]),
];
