export default () => {
  return [
    {
      hook: "prerender",
      middleware: (req, res, next) => {
        res.locals.fitnoteImg = req.session.fitnoteImg;
        const methodObtained =
          req.casa.journeyContext.data["method-obtained"].methodObtained;
        res.locals.guidanceLink = "/digital-guidance";
        if (methodObtained == "paper") {
          res.locals.guidanceLink = "/paper-guidance";
        }

        if (req.session.uploadCount && req.session.uploadCount > 1) {
          res.locals.showGuidance = true;
        }

        if (req.session.visibleRegion) {
          res.locals.visibleRegion = req.session.visibleRegion;
        }

        next();
      },
    },
  ];
};
