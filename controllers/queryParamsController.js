const UserService = require("../service/user");
const fs = require("fs");
const path = require("path");
const errorMessages = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../errors.json"), "utf-8")
);


async function nameStartsWith(req, res) {
  if (
    !("namePrefix" in req.query) ||
    typeof req.query.namePrefix !== "string"||
    !/^[a-zA-Z]+$/.test(req.query.namePrefix)
  ) {
    return res.status(400).json({
      validationError: "INVALID_INPUT",
      msg: errorMessages.INVALID_INPUT,
    });
  }
  try {
    const answer = await UserService.getUsersQueryParam(req.query.namePrefix);
    if (answer.length === 0) {
      return res.status(404).json({
        validationError: "QUERY_RESULT_EMPTY",
        msg: errorMessages.QUERY_RESULT_EMPTY,
      });
    }
    res.status(200).json(answer);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}
async function fetchUserByIDParam(req, res) {
  try {
    if (!("id" in req.query)) {
      return res.status(400).json({
        validationError: "INVALID_INPUT",
        msg: errorMessages.INVALID_INPUT,
      });
    }
    const id = parseInt(req.query.id)
    if(isNaN(id)){
      return res.status(401).json({
        validationError:"INVALID_INPUT",
        msg: errorMessages.INVALID_INPUT,
      })
    }
    console.log(id)
    const answer = await UserService.fetchUserByIDParam(id);
    if (!answer) {
      return res.status(400).json({
        validationError: "DOES_NOT_EXIST",
        msg: errorMessages.DOES_NOT_EXIST,
      });
    }
    res.status(200).json({
      answer,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}
async function greaterThansalaryFilterParam(req, res) {
  try {
   
    if (
      !("SalaryParam" in req.query)) {
      return res.status(400).json({
        validationError: "INVALID_INPUT",
        msg: errorMessages.INVALID_INPUT,
      });
    }
    const limit = parseInt(req.query.SalaryParam);
    if(isNaN(limit)){
      return res.status(401).json({
        validationError:"INVALID_INPUT",
        msg: errorMessages.INVALID_INPUT,
      })
    }
 
    const answer = await UserService.getUsersBySalaryQueryParam(limit);
    if (answer.length === 0) {
      res.status(404).json({
        validationError: "QUERY_RESULT_EMPTY",
        msg: errorMessages.QUERY_RESULT_EMPTY,
      });
    }
    res.status(200).json(answer);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
}

module.exports = {
  nameStartsWith,
  greaterThansalaryFilterParam,
  fetchUserByIDParam,
};
