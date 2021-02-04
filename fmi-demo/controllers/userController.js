const userModel = require("../models/userModel");

exports.registerAPI = async function (req, res) {
  try {
    const response = await userModel.register(req.body);
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.loginAPI = function(req, res) {
  userModel
    .login(req.body)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json({ error: "error has occurred" });
    });
};
