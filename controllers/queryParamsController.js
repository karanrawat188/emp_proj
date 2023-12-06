const UserService = require("../service/user");
const fs = require("fs");
const path = require("path");
const errorMessages = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../errors.json"), "utf-8")
);

async function queryRoutes(req, res) {
  try {
    const queryParam = req.query;
    const user = await UserService.getUsers(queryParam);
    console.log(user)
    if (user.length > 0) {
      res.status(200).json(user);
    } else {
      res.status(404).json({
        validationError: `INVALID INPUT`,
        err: errorMessages.INVALID_INPUT,
      });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  queryRoutes,
};
