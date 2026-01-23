import { Plan } from "@dwp/govuk-casa";

export default () => {
  const plan = new Plan({
    arbiter: "auto",
  });

  plan.setRoute(
    "esa",
    "no-esa",
    (route, context) => context.data["esa"]["esa"] === "no",
  );

  plan.setRoute(
    "esa",
    "method-obtained",
    (route, context) => context.data["esa"]["esa"] === "yes",
  );

  plan.setRoute(
    "method-obtained",
    "guidance-digital",
    (route, context) =>
      context.data["method-obtained"]["methodObtained"] === "digital",
  );

  plan.setRoute(
    "method-obtained",
    "guidance-paper",
    (route, context) =>
      context.data["method-obtained"]["methodObtained"] === "paper",
  );

  plan.setRoute("guidance-digital", "upload");
  plan.setRoute("guidance-paper", "upload");

  plan.setRoute("upload", "photo-audit");

  plan.setRoute("photo-audit", "nino");

  plan.setRoute("nino", "address");

  plan.setRoute("address", "text-message");

  plan.addSequence("text-message", "check-your-answers");

  return plan;
};
