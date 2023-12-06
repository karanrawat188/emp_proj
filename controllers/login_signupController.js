const UserService = require("../service/user");
const { createToken } = require("./jwtAuth");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { performValidation } = require("../validation/validation");
const { error } = require("console");
const errorMessages = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../errors.json"), "utf-8")
);
const maxAge = 3 * 24 * 60 * 60;

async function signup_post(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const dob = req.body.dob;
  const gender = req.body.gender;
  const email = req.body.email;
  const department = req.body.department;
  const manager = req.body.manager;
  const address = req.body.address;
  const password = req.body.password;
  const role = req.body.role;
  const phone = req.body.phone;
  const salary = req.body.salary;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;

  console.log("Received form data:", {
    firstName,
    lastName,
    dob,
    gender,
    email,
    department,
    manager,
    address,
    password,
    role,
    phone,
    salary,
    latitude,
    longitude,
  });

  const validationArr = performValidation(req.body);
  console.log(validationArr);
  if (validationArr.length > 0) {
    return res.status(400).json({
      err: "signup failure",
      msg: validationArr,
    });
  }

  const isUserEmailUnique = await UserService.isEmailUniquePost(email);
  if (isUserEmailUnique.length > 0) {
    return res.status(404).json({
      validationError: "INVALID_EMAIL",
      msg: errorMessages.INVALID_EMAIL,
    });
  }
  try {
    if (role === "admin") {
      if (manager) {
        return res.status(400).json({
          validationError: "MAN_ILLEGAL_IP",
          msg: errorMessages.MAN_ILLEGAL_IP,
        });
      }
      const userExists = await UserService.getAdmin(department);
      console.log(userExists);
      if (userExists.length > 0) {
        return res.status(400).json({
          validationError: "ADMIN_ALREADY_ASSIGNED",
          msg: errorMessages.ADMIN_ALREADY_ASSIGNED,
        });
      }
    }

    if (role === "manager") {
      if (manager) {
        return res.status(400).json({
          validationError: "MAN_ILLEGAL_IP",
          msg: errorMessages.MAN_ILLEGAL_IP,
        });
      }
      const userExists = UserService.getManagerFromDept(department);
      if (userExists.length > 0) {
        return res.status(400).json({
          validationError: "DEPARTMENT_ALREADY_EXISTS",
          msg: errorMessages.DEPARTMENT_ALREADY_EXISTS,
        });
      }
    }
    if (role === "employee") {
      if (!manager) {
        return res.status(400).json({
          validationError: "ENTER_MANAGER",
          msg: errorMessages.ENTER_MANAGER,
        });
      }
      const getManager = await UserService.getManager(manager, department);
      if (getManager.length === 0) {
        return res.status(400).json({
          validationError: "INVALID_MANAGER_ID",
          msg: errorMessages.INVALID_MANAGER_ID
        });
      }
    }
    const location = `POINT(${longitude} ${latitude})`;
    const id = await UserService.createUser(
      firstName,
      lastName,
      dob,
      gender,
      email,
      department,
      manager,
      address,
      password,
      role,
      phone,
      salary,
      location
    );

    // jwt signing

    const data = {
      department: department,
      email: email,
      role: role,
      id: id,
    };
    const token = createToken(data, maxAge);

    res.status(201).json({
      msg: "user successfully created!",
      jwttoken: token,
      id,
    });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode || 400).json({
      error: error.message,
    });
  }
}
async function login_post(req, res) {
  if (
    !req.body.email ||
    typeof req.body.email !== "string" ||
    !req.body.password ||
    typeof req.body.password !== "string"
  ) {
    return res.status(404).json({
      msg: errorMessages.INVALID_INPUT,
    });
  }

  const { email, password } = req.body;
  try {
    const user = await UserService.isEmailUnique(email);
    if (!user) {
      return res.status(404).json({
        validationError: "INVALID_INPUT",
        msg: errorMessages.INVALID_INPUT,
      });
    }
    const gethp = await UserService.fetchpassword(email);
    const result = await UserService.bcryptCompare(password, gethp);
    if (!result) {
      return res.status(400).json({
        validationError: "DOES_NOT_EXIST",
        error: errorMessages.DOES_NOT_EXIST,
      });
    }
    const userDetail = await UserService.getUserByEmail(email);

    //session create yaha hoga
    const data = {
      department: userDetail.department,
      email: userDetail.email,
      role: userDetail.role,
      id: userDetail.employee_id,
    };
    console.log(data);
    const token = createToken(data, maxAge);
    return res.status(200).json({
      token,
      userDetail,
    });
  } catch (error) {
    console.log(error);
    return res.status(error.statusCode).json({
      error: error.message,
    });
  }
}

async function employeeDetails(req, res) {
  const users = await UserService.getAllUsers();
  console.log(users);
  return res.status(200).json(users);
}

module.exports = {
  login_post,
  signup_post,
  employeeDetails,
};
