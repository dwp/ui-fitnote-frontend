// Convert a string in to a base 64 encoded string
exports.getRoute = function getRoute(req) {
  let route;
  if (typeof req.cookies.route !== 'undefined') {
    if (req.cookies.route === 'upload-digital') {
      route = 'upload?ref=digital';
    } else if (req.cookies.route === 'upload-paper') {
      route = 'upload?ref=paper';
    } else {
      route = req.cookies.route;
    }
  } else {
    route = 'take';
  }

  return route;
};
