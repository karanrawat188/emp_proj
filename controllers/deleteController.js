const fs = require("fs");
const path = require("path");
const errorMessages = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../errors.json"), "utf-8")
);
const UserService = require("../service/user");

//deletion
async function deleteEmployee(req, res) {
  try {
    if (!req.body.id || typeof req.body.id !== "number") {
      return res.status(404).json({
        validationError: "INVALID_INPUT",
        msg: errorMessages.INVALID_INPUT,
      });
    }
    const eid = req.body.id;
    const userRole = req.user.role;
    const toBeDeleted = await UserService.getUserByID(eid);

    if (toBeDeleted.length === 0) {
      return res.status(404).json({
        validationError: "ID_NOT_ENTERED",
        msg: errorMessages.ID_NOT_ENTERED,
      });
    }
    console.log(toBeDeleted); // ye check karna hai kii array return karna hai ya object !!!
    const toBeDeletedRole = toBeDeleted[0].role;
    if (
      toBeDeletedRole === "employee" &&
      (userRole === "manager" || userRole === "admin")
    ) {
      const arr = [userRole, req.user.email];
      await UserService.deleteUserByID(eid);

      await UserService.storeLog(toBeDeleted[0], arr);
      return res.status(201).json({
        msg: `User successfully deleted of employee id ${toBeDeletedRole}`,
      });
    } else {
      return res.status(401).json({
        validationError: "UNAUTHORIZED",
        msg: errorMessages.UNAUTHORIZED,
      });
    }
  } catch (err) {
    return res.status(err.statusCode || 404).json({ error: err.message });
  }
}

async function deletedLogs(req, res) {
  const data = await UserService.getDeletedLogs();
  return res.status(201).json(data);
}

async function deleteManager(req, res) {
  try {
    if (
      !req.body.id ||
      typeof req.body.id !== "number" ||
      !req.body.newAssignedDepartment ||
      typeof req.body.newAssignedDepartment !== "string"
    ) {
      return res.status(404).json({
        validationError:"INVALID_INPUT",
        msg:errorMessages.INVALID_INPUT
      });
    }

    const isAdmin = req.user.role;
    const eid = req.body.id; // iss id ko delete karna hai 
    const toBeDeleted = await UserService.getUserByID(eid); // data le lia
    if(toBeDeleted.length===0){
      return res.status(404).json({
        validationError:"INVALID_INPUT",
        msg:errorMessages.INVALID_INPUT
      })
    }
    const toBeDel=toBeDeleted[0];
    console.log(toBeDel)
    const toBeDelDept=toBeDel.department;

    console.log(toBeDeleted);
    if (toBeDeleted.length === 0) {
      return res.status(404).json({
        validationError: "DOES_NOT_EXIST",
        msg: errorMessages.DOES_NOT_EXIST,
      });
    }
    const toBeDeletedRole = toBeDeleted[0].role;  // role manager hona chaeye
    if (isAdmin === "admin" && toBeDeletedRole === "manager") {
      const newDepartment = req.body.newAssignedDepartment;
      if (
        newDepartment !== "IT" &&
        newDepartment !== "Accounts" &&
        newDepartment !== "Sales" &&
        newDepartment !== "Marketing" &&
        newDepartment !== "Finance" &&
        newDepartment !== "HR" &&
        newDepartment !== "Others"
      ) {
        console.log(newDepartment) 
        return res.status(400).json({
          validationError: "INVALID_DEPARTMENT",
          msg: errorMessages.INVALID_DEPARTMENT,
        });
      }

      const newManagerID =await UserService.getManagerIdFromDept(newDepartment); // new department should exists and be assigned
      if(!newManagerID){
        return res.status(404).json({
            validationError:"DEPARTMENT_NOT_ASSIGNED",
            msg:errorMessages.DEPARTMENT_NOT_ASSIGNED
        })
      }
      const arr = [isAdmin, req.user.email];
      await UserService.deleteManagerByID(
        eid,
        newManagerID.manager_id,
        newDepartment,
        toBeDel.email,
        toBeDelDept,
      );
      
      await UserService.storeLog(toBeDeleted[0],arr);
      return res.status(201).json({
        msg: `User successfully deleted of employee id ${toBeDeleted[0]}`,
      });
    } else {
      return res.status(401).json({
        validatoionError: "UNAUTHORIZED",
        msg: errorMessages.UNAUTHORIZED,
      });
    }
  } catch (err) {
    throw new Error(err);
  }
}
module.exports = {
  deleteEmployee,
  deletedLogs,
  deleteManager,
};
