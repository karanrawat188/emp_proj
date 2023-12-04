const fs = require("fs");
const path = require("path");
const UserService = require("../service/user");
const { createToken } = require("./jwtAuth");
const errorMessages = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../errors.json"), "utf-8")
);
const { performValidation } = require("../validation/validation");
const maxAge = 3 * 24 * 60 * 60;
async function updateOrInsertEmployee(req, res) {
  try {
    const id = req.body.id;
    if (!id) {
      const validationArr = performValidation(req.body);
      if (validationArr.length > 0) {
        return res.status(400).json({
          err: "upsert failure",
          msg: validationArr,
        });
      }
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

      if (role === "manager" || role === "admin") {
        return res.status(400).json({
          validationError: "UNAUTHORIZED",
          msg: errorMessages.UNAUTHORIZED,
        });
      }
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
      const isUserEmailUnique = await UserService.isEmailUnique(email);
      if (isUserEmailUnique) {
        return res.status(404).json({
          validationError: "INVALID_EMAIL",
          msg: errorMessages.INVALID_EMAIL,
        });
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
    }
    //updation
    else {
      if (id !== req.user.id) {
        return res.status(401).json({
          validationError: "UNAUTHORIZED",
          msg: errorMessages.UNAUTHORIZED,
        });
      }

      const getId = await UserService.getUserByID(id);
      const email = getId[0].email;
      if (
        !("newFirstName" in req.body) &&
        !("newLastName" in req.body) &&
        !("newAddress" in req.body) &&
        !("newPhone" in req.body)
      ) {
        return res.status(204).json({
          validationError: "N",
          msg: errorMessages.N,
        });
      }

      const { newFirstName, newLastName, newPhone, newAddress } = req.body;
      if (newFirstName) {
        if (
          typeof newFirstName === "string" &&
          /^[a-zA-Z]+$/.test(newFirstName)
        ) {
          await UserService.updateFirstName(newFirstName, email);
        } else {
          return res.status(400).json({
            validationError: "INVALID_FNAME",
            err: errorMessages.INVALID_FNAME,
          });
        }
      }
      if (newLastName) {
        if (
          typeof newLastName === "string" &&
          /^[a-zA-Z]+$/.test(newLastName)
        ) {
          await UserService.updateLastName(newLastName, email);
        } else {
          return res.status(400).json({
            validationError: "INVALID_LNAME",
            err: errorMessages.INVALID_LNAME,
          });
        }
      }

      if (newPhone) {
        if (typeof newPhone === "number") {
          await UserService.updatePhone(newPhone, email);
        } else {
          return res.status(400).json({
            validationError: "INVALID_PNUMBER",
            err: errorMessages.INVALID_PNUMBER,
          });
        }
      }
      if (newAddress) {
        if (typeof newAddress === "string") {
          await UserService.updateAddress(newAddress, email);
        } else {
          return res.status(400).json({
            validationError: "INVALID_ADDRESS",
            err: errorMessages.INVALID_ADDRESS,
          });
        }
      }
      return res.status(200).json({
        msg: `Entries updated `,
      });
    }
  } catch (err) {
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

async function updateEmployee(){

      const getId = await UserService.getUserByID(req.user.id);
      const email = getId[0].email;
      if (
        !("newFirstName" in req.body) &&
        !("newLastName" in req.body) &&
        !("newAddress" in req.body) &&
        !("newPhone" in req.body)
      ) {
        return res.status(204).json({
          validationError: "N",
          msg: errorMessages.N,
        });
      }

      const { newFirstName, newLastName, newPhone, newAddress } = req.body;
      if (newFirstName) {
        if (
          typeof newFirstName === "string" &&
          /^[a-zA-Z]+$/.test(newFirstName)
        ) {
          await UserService.updateFirstName(newFirstName, email);
        } else {
          return res.status(400).json({
            validationError: "INVALID_FNAME",
            err: errorMessages.INVALID_FNAME,
          });
        }
      }
      if (newLastName) {
        if (
          typeof newLastName === "string" &&
          /^[a-zA-Z]+$/.test(newLastName)
        ) {
          await UserService.updateLastName(newLastName, email);
        } else {
          return res.status(400).json({
            validationError: "INVALID_LNAME",
            err: errorMessages.INVALID_LNAME,
          });
        }
      }

      if (newPhone) {
        if (typeof newPhone === "number") {
          await UserService.updatePhone(newPhone, email);
        } else {
          return res.status(400).json({
            validationError: "INVALID_PNUMBER",
            err: errorMessages.INVALID_PNUMBER,
          });
        }
      }
      if (newAddress) {
        if (typeof newAddress === "string") {
          await UserService.updateAddress(newAddress, email);
        } else {
          return res.status(400).json({
            validationError: "INVALID_ADDRESS",
            err: errorMessages.INVALID_ADDRESS,
          });
        }
      }
      return res.status(200).json({
        msg: `Entries updated `,
      });
}

module.exports = {
  updateOrInsertEmployee,
  updateEmployee,
};
