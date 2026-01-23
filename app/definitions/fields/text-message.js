import { field, validators as r } from "@dwp/govuk-casa";

export default () => [
  field("textMessage").validators([
    r.required.make({
      errorMsg: "text-message:field.mobileNumber.empty",
    }),
    r.inArray.make({
      source: ["yes", "no"],
      errorMsg: "text-message:field.mobileNumber.empty",
    }),
  ]),
  field("mobileNumber")
    .validators([
      r.required.make({
        errorMsg: "text-message:field.mobileNumber.format",
      }),
      r.regex.make({
        pattern: /^\+?[ 0-9]{11,20}$/,
        errorMsg: "text-message:field.mobileNumber.format",
      }),
    ])
    .conditions([
      ({ journeyContext: c, waypoint: w }) =>
        c.data?.[w]?.textMessage === "yes",
    ]),
];
