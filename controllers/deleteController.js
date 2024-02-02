const fs = require("fs");
const path = require("path");
const errorMessages = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../errors.json"), "utf-8")
);
const UserService = require("../service/user");
const client = require("../es_config");

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
      await client.delete({
        index: "employee",
        id: eid,
      });
      await UserService.storeLog(toBeDeleted[0], arr);

      return res.status(201).json({
        msg: `User successfully deleted`,
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



async function deleteManager(req, res) {
  try {
    if (
      // fetch id , old Dept , new Dept from req.body

      !req.body.id ||
      typeof req.body.id !== "number" ||
      !req.body.newAssignedDepartment ||
      typeof req.body.newAssignedDepartment !== "string" ||
      !req.body.delDept ||
      typeof req.body.delDept !== "string"
    ) {
      return res.status(404).json({
        validationError: "INVALID_INPUT",
        msg: errorMessages.INVALID_INPUT,
      });
    }

    const isAdmin = req.user.role;
    const managerData = await UserService.getManager(
      req.body.id,
      req.body.delDept
    );
    console.log(managerData);
    if (managerData.length === 0) {
      return res.status(404).json({
        validationError: "INVALID_INPUT",
        msg: errorMessages.INVALID_INPUT,
      });
    }


    //checking authorization and validity
    if (isAdmin === "admin") {
      const newDepartment = req.body.newAssignedDepartment;
      if (
        newDepartment !== "IT" &&
        newDepartment !== "Accounts" &&
        newDepartment !== "Sales" &&
        newDepartment !== "Marketing" &&
        newDepartment !== "Finance" &&
        newDepartment !== "HR" &&
        newDepartment !== "Others"&&
        newDepartment!=="Finance"
      ) {
        console.log(newDepartment);
        return res.status(400).json({
          validationError: "INVALID_DEPARTMENT",
          msg: errorMessages.INVALID_DEPARTMENT,
        });
      }

      const newManagerID = await UserService.getManagerIdFromDept(
        newDepartment
      ); // new department should exists and be assigned
      if (newManagerID.length === 0) {
        return res.status(404).json({
          validationError: "DEPARTMENT_NOT_ASSIGNED",
          msg: errorMessages.DEPARTMENT_NOT_ASSIGNED,
        });
      }
      const arr = [isAdmin, req.user.email];
      await UserService.deleteManagerByID(
        newManagerID[0].employee_id,
        newDepartment,
        managerData[0].employee_id
      );

      await UserService.storeLog(managerData[0], arr);
      const data = await client.delete({
        index: "employee",
        id: req.body.id,
      });
      console.log("deleted from ELK", data);

      const upd = await client.updateByQuery({
        index: "employee",
        body: {
          query: {
            match: { manager_id: req.body.id },
          },
          script: {
            source: "ctx._source.manager_id = params.nmid ; ctx._source.department = params.dpt",
            params: {
              nmid: newManagerID[0].employee_id,
              dpt: newDepartment,
            },
          },
        },
      });
      console.log("updated from ELK", upd);
      return res.status(201).json({
        msg: `Manager successfully deleted `,
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
  deleteManager,
};
