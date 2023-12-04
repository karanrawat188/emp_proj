const UserService = require("../service/user");
const { createToken } = require("./jwtAuth");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { performValidation } = require("../validation/validation");
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
  if (isUserEmailUnique.length>0) {
    return res.status(404).json({
      validationError: "INVALID_EMAIL",
      msg: errorMessages.INVALID_EMAIL,
    });
  }
  let managerId, adminId;
  try {
    if (role === "admin") {
      if (manager) {
        return res.status(404).json({
          validationError: "MAN_ILLEGAL_IP",
          msg: errorMessages.MAN_ILLEGAL_IP,
        });
      }
      const adminData = {
        email,
        department,
      };
      const adminUnique = await UserService.isAdminUnique(department);
      if (adminUnique) {
        return res.status(404).json({
          validationError: "ADMIN_ALERADY_ASSIGNED",
          msg: errorMessages.ADMIN_ALERADY_ASSIGNED,
        });
      }
      adminId = await UserService.createManager(adminData);
    }
    if (role === "manager") {
      if (manager) {
        return res.status(404).json({
          validationError: "MAN_ILLEGAL_IP",
          msg: errorMessages.MAN_ILLEGAL_IP,
        });
      }
      const managerUnique = await UserService.isManagerUnique(email);
      const departmentUnique = await UserService.isDeptUnique(department);

      if (departmentUnique) {
        return res.status(404).json({
          validationError: "DEPARTMENT_ALERADY_EXISTS",
          msg: errorMessages.DEPARTMENT_ALREADY_EXISTS,
        });
      }
      if (managerUnique) {
        return res.status(404).json({
          validationError: "MANAGER_ALERADY_EXISTS",
          msg: errorMessages.MANAGER_ALREADY_EXISTS,
        });
      }
      const managerData = {
        email,
        department,
      };

      managerId = await UserService.createManager(managerData);
    }
    if (role === "employee") {
      if (!manager) {
        return res.status(404).json({
          validationError: "ENTER_MANAGER",
          msg: errorMessages.ENTER_MANAGER,
        });
      }
      const deptName = await UserService.getDeptCorrespondingManager(manager);
      if (!deptName) {
        return res.status(404).json({
          validationError: "MANAGER_DOES_NOT_EXIST",
          msg: errorMessages.MANAGER_DOES_NOT_EXIST,
        });
      }
      if (
        deptName.department !== department ||
        deptName.department === "Administrator"
      ) {
        return res.status(400).json({
          validationError: "INV_MANAGER_REQ",
          msg: errorMessages.INV_MANAGER_REQ,
        });
      }
      // const isUserEmailUnique = await UserService.isEmailUniquePost(email);
      // if (isUserEmailUnique) {
      //   return res.status(404).json({
      //     validationError: "INVALID_EMAIL",
      //     msg: errorMessages.INVALID_EMAIL,
      //   });
      // }
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
      managerId,
      adminId,
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
