const endpointsJson = require("../endpoints.json");

exports.getApi = (req, res) => {
  console.log(endpointsJson);
  res.status(200).send({ endpoints: endpointsJson });
};