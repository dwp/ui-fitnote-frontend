import esaFields from "./fields/esa.js";
import methodObtainedFields from "./fields/method-obtained.js";
import fileUploadFields from "./fields/upload.js";
import ninoFields from "./fields/nino.js";
import addressFields from "./fields/address.js";
import textMessageFields from "./fields/text-message.js";

import esaHooks from "./page-hooks/esa.js";
import uploadHooks from "./page-hooks/upload.js";
import photoAuditHooks from "./page-hooks/photo-audit.js";
import ninoHooks from "./page-hooks/nino.js";
import addressHooks from "./page-hooks/address.js";
import textMessageHooks from "./page-hooks/text-message.js";
import checkYourAnswersHooks from "./page-hooks/check-your-answers.js";

export default () => [
  {
    waypoint: "esa",
    view: "pages/esa.njk",
    fields: esaFields(),
    hooks: esaHooks(),
  },
  {
    waypoint: "no-esa",
    view: "pages/no-esa.njk",
  },
  {
    waypoint: "method-obtained",
    view: "pages/method-obtained.njk",
    fields: methodObtainedFields(),
  },
  {
    waypoint: "guidance-digital",
    view: "pages/guidance-digital.njk",
  },
  {
    waypoint: "guidance-paper",
    view: "pages/guidance-paper.njk",
  },
  {
    waypoint: "upload",
    view: "pages/upload.njk",
    fields: fileUploadFields(),
    hooks: uploadHooks(),
  },
  {
    waypoint: "photo-audit",
    view: "pages/photo-audit.njk",
    hooks: photoAuditHooks(),
  },
  {
    waypoint: "nino",
    view: "pages/nino.njk",
    hooks: ninoHooks(),
    fields: ninoFields(),
  },
  {
    waypoint: "address",
    view: "pages/address.njk",
    hooks: addressHooks(),
    fields: addressFields(),
  },
  {
    waypoint: "text-message",
    view: "pages/text-message.njk",
    hooks: textMessageHooks(),
    fields: textMessageFields(),
  },
  {
    waypoint: "check-your-answers",
    view: "pages/check-your-answers.njk",
    hooks: checkYourAnswersHooks(),
  },
];
