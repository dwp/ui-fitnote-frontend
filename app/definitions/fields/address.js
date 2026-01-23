import { field, validators as r } from "@dwp/govuk-casa";

export default () => [
  field("houseNumber").validators([
    r.required.make({
      errorMsg: "address:field.houseNumber.empty",
    }),
  ]),
  field("postcode").validators([
    r.required.make({
      errorMsg: "address:field.postcode.empty",
    }),
    r.regex.make({
      pattern:
        /^(?![QVX])[A-Z]((?![IJZ])[A-Z][0-9]([0-9]?|[ABEHMNPRVWXY]?)|[0-9]([0-9]?|[ABCDEFGHJKPSTUW]?))[0-9](?![CIKMOV])[A-Z]{2}$/,
      errorMsg: "address:field.postcode.format",
    }),
  ]),
];
