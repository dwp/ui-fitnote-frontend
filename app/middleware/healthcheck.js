function healthCheck(req, res) {
  res.status(200).send('okay');
}

module.exports.healthCheck = healthCheck;
