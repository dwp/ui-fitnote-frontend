import { waypointUrl } from "@dwp/govuk-casa";

import submitDeclaration from "../../lib/submit-declaration.js";

const makeAddress = ({ houseNumber, postcode }) =>
  `${houseNumber},${postcode}`.replace(/,+/g, `<br>`);

const makeValue = (t, key, value) => {
  if (key === "check-your-answers:address") {
    return { html: value };
  } else {
    if (value === "yes") {
      return { text: t("check-your-answers:yes") };
    }
    if (value === "no") {
      return { text: t("check-your-answers:no") };
    }
    return { text: value };
  }
};

export default () => {
  const rowFactory =
    (t, mountUrl, journeyContext) =>
    (waypoint, fieldName, value, key = `check-your-answers:${fieldName}`) => ({
      key: { text: t(key) },
      value: makeValue(t, key, value),
      actions: {
        items: [
          {
            text: t("check-your-answers:change"),
            visuallyHiddenText: t(key),
            attributes: {
              id: `change-${fieldName}`,
            },
            href: waypointUrl({
              journeyContext,
              waypoint,
              mountUrl,
              edit: true,
              editOrigin: waypointUrl({
                journeyContext,
                mountUrl,
                waypoint: "check-your-answers",
              }),
            }),
          },
        ],
      },
    });

  return [
    {
      hook: "prerender",
      middleware: (req, res, next) => {
        const d = req.casa.journeyContext.data;
        const row = rowFactory(
          req.t,
          `${req.baseUrl}/`,
          req.casa.journeyContext,
        );

        res.locals.rows = [
          row("nino", "nino", d.nino.nino),
          row("address", "address", makeAddress(d.address)),
        ];

        if (d["text-message"].textMessage === "yes") {
          res.locals.rows = [
            ...res.locals.rows,
            row("text-message", "text-message", "yes"),
          ];
          res.locals.rows = [
            ...res.locals.rows,
            row(
              "text-message",
              "mobile-number",
              d["text-message"].mobileNumber,
            ),
          ];
        } else {
          res.locals.rows = [
            ...res.locals.rows,
            row("text-message", "text-message", "no"),
          ];
        }

        next();
      },
    },
    {
      hook: "postvalidate",
      middleware: async (req, res) => {
        await submitDeclaration(req, res);
      },
    },
  ];
};
