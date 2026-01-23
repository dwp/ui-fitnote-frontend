export default () => {
  return [
    {
      hook: "preredirect",
      middleware: (req, res, next) => {
        req.session.validSession = true;
        next();
      },
    },
    {
      hook: "prerender",
      middleware: (req, res, next) => {
        if (
          typeof req.session.validSession === "undefined" ||
          req.session.validSession
        ) {
          req.session.validSession = true;
          next();
        } else {
          res.redirect("/session-timeout");
        }
      },
    },
  ];
};
