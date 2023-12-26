const fs = require("fs");
const path = require("path");
const { DateTime } = require("luxon");
const UserService = require("../service/user");
const errorMessages = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../errors.json"), "utf-8")
);
const validator = require("validator");

function performValidation(inputs) {
  let err = [];
  if (!("firstName" in inputs) || typeof inputs.firstName !== "string") {
    err.push({
      validationError: "INVALID_NAME",
      error: errorMessages.INVALID_FNAME,
    });
  }
  if (
    "firstName" in inputs &&
    typeof inputs.firstName === "string" &&
    !/^[a-zA-Z]+$/.test(inputs.firstName)
  ) {
    err.push({
      validationError: "INVALID_NAME",
      error: errorMessages.INVALID_NAME,
    });
  }
  if (
    "lastName" in inputs &&
    typeof inputs.lastName === "string" &&
    !/^[a-zA-Z]+$/.test(inputs.lastName)
  ) {
    err.push({
      validationError: "INVALID_NAME",
      error: errorMessages.INVALID_NAME,
    });
  }
  if (!("lastName" in inputs) || typeof inputs.lastName !== "string") {
    err.push({
      validationError: "INVALID_LNAME",
      error: errorMessages.INVALID_LNAME,
    });
  }

  if (
    !("dob" in inputs) ||
    !DateTime.fromFormat(inputs.dob, "yyyy-MM-dd").isValid
  ) {
    err.push({
      validationError: "INVALID_DATE",
      error: errorMessages.INVALID_DATE,
    });
  }

  if (!("address" in inputs) || typeof inputs.address !== "string") {
    err.push({
      validationError: "INVALID_ADDRESS",
      error: errorMessages.INVALID_ADDRESS,
    });
  }
  if (
    !("gender" in inputs) ||
    typeof inputs.gender !== "string" ||
    (inputs.gender !== "male" &&
      inputs.gender !== "female" &&
      inputs.gender !== "other")
  ) {
    err.push({
      validationError: "INVALID_GENDER",
      error: errorMessages.INVALID_GENDER,
    });
  }

  if (
    !("join_date" in inputs) ||
    !DateTime.fromFormat(inputs.join_date, "yyyy-MM-dd").isValid
  ) {
    err.push({
      validationError: "INVALID_DOJ",
      error: errorMessages.INVALID_DOJ,
    });
  }

  if (!("phone" in inputs) || typeof inputs.phone !== "number") {
    err.push({
      validationError: "INVALID_PNUMBER",
      error: errorMessages.INVALID_PNUMBER,
    });
  }

  if (!("latitude" in inputs) || typeof inputs.latitude !== "number") {
    err.push({
      validationError: "INVALID_LAT",
      error: errorMessages.INVALID_LAT,
    });
  }
  if (
    !("email" in inputs) ||
    typeof inputs.email !== "string" ||
    !validator.isEmail(inputs.email)
  ) {
    err.push({
      validationError: "EMAIL_NOT_ENTERED",
      error: errorMessages.EMAIL_NOT_ENTERED,
    });
  }

  if (!("longitude" in inputs) || typeof inputs.longitude !== "number") {
    err.push({
      validationError: "INVALID_LONG",
      error: errorMessages.INVALID_LONG,
    });
  }
  if (
    !("department" in inputs) ||
    typeof inputs.department !== "string" ||
    (inputs.department !== "IT" &&
      inputs.department !== "Sales" &&
      inputs.department !== "HR" &&
      inputs.department !== "Finance" &&
      inputs.department !== "Administrator" &&
      inputs.department !== "Others" &&
      inputs.department !== "Accounts" &&
      inputs.department !== "Marketing")
  ) {
    err.push({
      validationError: "INVALID_DEPARTMENT",
      error: errorMessages.INVALID_DEPARTMENT,
    });
  }
  if (
    "department" in inputs &&
    typeof inputs.department === "string" &&
    inputs.department === "Administrator" &&
    inputs.role !== "admin"
  ) {
    err.push({
      validationError: "INVALID_ADMIN_DEPT",
      error: errorMessages.INVALID_ADMIN_DEPT,
    });
  }
  if (
    !("role" in inputs) ||
    typeof inputs.role !== "string" ||
    (inputs.role !== "admin" &&
      inputs.role !== "employee" &&
      inputs.role !== "manager")
  ) {
    err.push({
      validationError: "INVALID_ROLE_IP",
      error: errorMessages.INVALID_ROLE_IP,
    });
  }
  if (
    "department" in inputs &&
    "role" in inputs &&
    inputs.department === "Administrator" &&
    (inputs.role === "manager" || inputs.role === "employee")
  ) {
    err.push({
      validationError: "INVALID_ROLE_IP",
      error: errorMessages.INVALID_ROLE_IP,
    });
  }
  if (
    "role" in inputs &&
    typeof inputs.role === "string" &&
    inputs.role === "admin" &&
    inputs.department !== "Administrator"
  ) {
    err.push({
      valiodationError: "INVALID_ADMIN_DEPT",
      error: errorMessages.INVALID_ADMIN_DEPT,
    });
  }
  if (!("salary" in inputs) || typeof inputs.salary !== "number") {
    err.push({
      validationError: "INVALID_SALARY",
      error: errorMessages.INVALID_SALARY,
    });
  }
  if ("manager" in inputs && typeof inputs.manager !== "number") {
    err.push({
      validationError: "INVALID_MANAGER_ID",
      error: errorMessages.INVALID_MANAGER_ID,
    });
  }
  return err;
}




















async function performEmployeeValidation(inputs) {
  let err = [];
  if ("id" in inputs) {
    if ("firstName" in inputs && typeof inputs.firstName !== "string") {
      err.push({
        validationError: "INVALID_NAME",
        error: errorMessages.INVALID_FNAME,
      });
    }
    if (
      "firstName" in inputs &&
      typeof inputs.firstName === "string" &&
      !/^[a-zA-Z]+$/.test(inputs.firstName)
    ) {
      err.push({
        validationError: "INVALID_NAME",
        error: errorMessages.INVALID_NAME,
      });
    }

    if ("lastName" in inputs && typeof inputs.lastName !== "string") {
      err.push({
        validationError: "INVALID_NAME",
        error: errorMessages.INVALID_FNAME,
      });
    }
    if (
      "lastName" in inputs &&
      typeof inputs.lastName === "string" &&
      !/^[a-zA-Z]+$/.test(inputs.lastName)
    ) {
      err.push({
        validationError: "INVALID_NAME",
        error: errorMessages.INVALID_NAME,
      });
    }
    if ("phone" in inputs && typeof inputs.phone !== "number") {
      err.push({
        validationError: "INVALID_PNUMBER",
        error: errorMessages.INVALID_PNUMBER,
      });
    }
    if ("address" in inputs && typeof inputs.address !== "string") {
      err.push({
        validationError: "INVALID_ADDRESS",
        error: errorMessages.INVALID_ADDRESS,
      });
    }
  } 
  
  
  else {
    if (!("firstName" in inputs) || typeof inputs.firstName !== "string") {
      err.push({
        validationError: "INVALID_NAME",
        error: errorMessages.INVALID_FNAME,
      });
    }
    if (
      "firstName" in inputs &&
      typeof inputs.firstName === "string" &&
      !/^[a-zA-Z]+$/.test(inputs.firstName)
    ) {
      err.push({
        validationError: "INVALID_NAME",
        error: errorMessages.INVALID_NAME,
      });
    }
    if (
      "lastName" in inputs &&
      typeof inputs.lastName === "string" &&
      !/^[a-zA-Z]+$/.test(inputs.lastName)
    ) {
      err.push({
        validationError: "INVALID_NAME",
        error: errorMessages.INVALID_NAME,
      });
    }
    if (!("lastName" in inputs) || typeof inputs.lastName !== "string") {
      err.push({
        validationError: "INVALID_LNAME",
        error: errorMessages.INVALID_LNAME,
      });
    }

    if (
      !("dob" in inputs) ||
      !DateTime.fromFormat(inputs.dob, "yyyy-MM-dd").isValid
    ) {
      err.push({
        validationError: "INVALID_DATE",
        error: errorMessages.INVALID_DATE,
      });
    }

    if (!("address" in inputs) || typeof inputs.address !== "string") {
      err.push({
        validationError: "INVALID_ADDRESS",
        error: errorMessages.INVALID_ADDRESS,
      });
    }
    if (
      !("gender" in inputs) ||
      typeof inputs.gender !== "string" ||
      (inputs.gender !== "male" &&
        inputs.gender !== "female" &&
        inputs.gender !== "other")
    ) {
      err.push({
        validationError: "INVALID_GENDER",
        error: errorMessages.INVALID_GENDER,
      });
    }

    if (
      !("join_date" in inputs) ||
      !DateTime.fromFormat(inputs.join_date, "yyyy-MM-dd").isValid
    ) {
      err.push({
        validationError: "INVALID_DOJ",
        error: errorMessages.INVALID_DOJ,
      });
    }

    if (!("phone" in inputs) || typeof inputs.phone !== "number") {
      err.push({
        validationError: "INVALID_PNUMBER",
        error: errorMessages.INVALID_PNUMBER,
      });
    }

    if (!("latitude" in inputs) || typeof inputs.latitude !== "number") {
      err.push({
        validationError: "INVALID_LAT",
        error: errorMessages.INVALID_LAT,
      });
    }
    if (
      !("email" in inputs) ||
      typeof inputs.email !== "string" ||
      !validator.isEmail(inputs.email)
    ) {
      err.push({
        validationError: "EMAIL_NOT_ENTERED",
        error: errorMessages.EMAIL_NOT_ENTERED,
      });
    }

    if (!("longitude" in inputs) || typeof inputs.longitude !== "number") {
      err.push({
        validationError: "INVALID_LONG",
        error: errorMessages.INVALID_LONG,
      });
    }
    if (
      !("department" in inputs) ||
      typeof inputs.department !== "string" ||
      (inputs.department !== "IT" &&
        inputs.department !== "Sales" &&
        inputs.department !== "HR" &&
        inputs.department !== "Finance" &&
        inputs.department !== "Others" &&
        inputs.department !== "Accounts" &&
        inputs.department !== "Marketing")
    ) {
      err.push({
        validationError: "INVALID_DEPARTMENT",
        error: errorMessages.INVALID_DEPARTMENT,
      });
    }
    if (
      !("role" in inputs) ||
      typeof inputs.role !== "string" ||
      inputs.role !== "employee"
    ) {
      err.push({
        validationError: "INVALID_ROLE_IP",
        error: errorMessages.INVALID_ROLE_IP,
      });
    }

    if (!("salary" in inputs) || typeof inputs.salary !== "number") {
      err.push({
        validationError: "INVALID_SALARY",
        error: errorMessages.INVALID_SALARY,
      });
    }
    if ("manager" in inputs && typeof inputs.manager !== "number") {
      err.push({
        validationError: "INVALID_MANAGER_ID",
        error: errorMessages.INVALID_MANAGER_ID,
      });
    }
    if ("manager" in inputs && typeof inputs.manager === "number") {
      const getManager = await UserService.getManager(
        inputs.manager,
        inputs.department
      );
      if (getManager.length === 0) {
        err.push({
          validationError: `MANAGER_DOES_NOT_EXIST ${inputs.manager}`,
          error: errorMessages.MANAGER_DOES_NOT_EXIST,
        });
      }
    }
    if ("email" in inputs) {
      const isUserEmailUnique = await UserService.isEmailUniquePost(
        inputs.email
      );
      if (isUserEmailUnique.length > 0) {
        err.push({
          validationError: `ALREADY_EXISTS ${inputs.email}`,
          msg: errorMessages.ALREADY_EXISTS,
        });
      }
    }
    if ("id" in inputs && typeof inputs.id !== "number") {
      err.push({
        validationError: `INVALID_INPUT id:${inputs.id}`,
        msg: errorMessages.INVALID_INPUT,
      });
    }
    if ("id" in inputs && typeof inputs.id === "number") {
      const user = UserService.getUserByID(inputs.id);
      if (!user) {
        err.push({
          validationError: `INVALID_INPUT id:{inputs.id}`,
          msg: errorMessages.INVALID_INPUT,
        });
      }
    }
  }

  return err;
}
module.exports = {
  performValidation,
  performEmployeeValidation,
};
