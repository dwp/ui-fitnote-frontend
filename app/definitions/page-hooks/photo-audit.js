import { photoRedirect } from "../../lib/photo-redirect.js";

export default () => {
  return [
    {
      hook: "postvalidate",
      middleware: async (req, res, next) => {
        await photoRedirect(req, res, next);
      },
    },
  ];
};
