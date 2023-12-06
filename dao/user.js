const db = require("../db/db");
const user = require("../service/user");
const { DateTime } = require("luxon");

class UserDAO {
  async createUser(
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
  ) {
    try {
      const [id] = await db("employee")
        .insert({
          first_name: firstName,
          email: email,
          last_name: lastName,
          gender: gender,
          manager_id: manager,
          address: address,
          password: password,
          department: department,
          dob: dob,
          role: role,
          phone: phone,
          salary: salary,
          location: location,
        })
        .returning("employee_id");

      return id;
    } catch (err) {
      throw new Error("Error occurred" + err.message);
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await db("employee").where({ email: email }).first();
      const { password, ...withoutpassword } = user;
      console.log(withoutpassword);
      return withoutpassword;
    } catch (err) {
      throw new Error("Error occurred" + err.message);
    }
  }
  async isEmailUniquePost(email) {
    try {
      const user = await db("employee").where({ email: email });
      return user;
    } catch (err) {
      throw new Error("Error occurred" + err.message);
    }
  }
  async isEmailUnique(email) {
    try {
      const existingUser = await db("employee").where("email", email).first();
      return existingUser;
    } catch (err) {
      throw new Error("Error occurred" + err.message);
    }
  }
  async fetchpassword(email) {
    try {
      const hp = await db("employee").where("email", email).first();
      const { password, ...withoutpassword } = hp;
      return password;
    } catch (err) {
      throw new Error("Error occurred" + err.message);
    }
  }

  async getAllUsers() {
    const users = await db("employee").select("*");

    // Map through the array and create a new array without the password property
    const usersWithoutPasswords = users.map((user) => {
      const { password, ...userExPass } = user;
      return userExPass;
    });

    return usersWithoutPasswords;
  }
  async fetchUserByIDParam(id) {
    const query = await db("employee").where("employee_id", id).first();
    const { password, ...withoutpassword } = query;
    return withoutpassword;
  }

  async getManagerName(managerId) {
    try {
      const result = await db("employee")
        .select("employee.first_name", "employee.last_name")
        .join("manager", "employee.email", "=", "manager.email")
        .where("manager.manager_id", managerId);
      return result;
    } catch (error) {
      throw new Error(`Error fetching manager name: ${error.message}`);
    }
  }
  async updateFirstName(newFirstName, id) {
    const result = await db("employee")
      .where("employee_id", id)
      .update({ first_name: newFirstName });
    return result;
  }
  async updateLastName(newLastName, id) {
    const result = await db("employee")
      .where("employee_id", id)
      .update({ last_name: newLastName });
    return result;
  }
  async updateAddress(newAddress, id) {
    const result = await db("employee")
      .where("employee_id", id)
      .update({ address: newAddress });
    return result;
  }
  async updatePhone(newPhone, id) {
    const result = await db("employee")
      .where("employee_id", id)
      .update({ phone: newPhone });
    return result;
  }
  async getNameQuery(namePrefix) {
    try {
      let query = db("employee")
        .select("*")
        .where("first_name", "ilike", `${namePrefix}%`);
      return query;
    } catch (err) {
      throw new Error("error occured " + err.message);
    }
  }
  async getSalaryQuery(salary) {
    try {
      let query = db("employee")
        .select(
          "first_name",
          "last_name",
          "gender",
          "dob",
          "address",
          "department",
          "manager_id",
          "join_date",
          "phone",
          "salary"
        )
        .where("salary", ">", salary);
      return query;
    } catch (err) {
      throw new Error("error occured " + err.message);
    }
  }
  async getEmployeeByID(id) {
    try {
      let query = await db("employee")
        .select(
          "employee_id",
          "first_name",
          "last_name",
          "gender",
          "dob",
          "address",
          "department",
          "manager_id",
          "join_date",
          "phone",
          "salary",
          "email",
          "role"
        )
        .where("employee_id", id);
      return query;
    } catch (err) {
      throw new Error("error occurred " + err.message);
    }
  }
  async deleteUserById(id) {
    try {
      let query = await db("employee").where("employee_id", "=", id).del();
      return query;
    } catch (err) {
      throw new Error("error occured " + err.message);
    }
  }
  async storeLogInfo(obj, arr) {
    try {
      let query = await db("log").insert({
        deleted_user_info: obj,
        departed_by: arr,
      });
      return query;
    } catch (err) {
      throw new Error("error occurred " + err.message);
    }
  }

  async deleteManagerByIDTransaction(newMID, newDepartment, oldMID) {
    return db.transaction(async (trx) => {
      try {
        await db("employee")
          .transacting(trx)
          .where("employee_id", "=", oldMID)
          .del();
        await db("employee")
          .transacting(trx)
          .where("manager_id", oldMID)
          .update({
            department: newDepartment,
            manager_id: newMID,
          });
      } catch (err) {
        await trx.rollback(err);
        throw err;
      }
    });
  }
  async getUsersWithFilter(userFilter) {
    const data = await db("employee")
      .where((builder) => {
        Object.entries(userFilter).forEach(([field, filter]) => {
          switch (filter.operator) {
            case "eq":
              if (filter.value == "string") {
                builder.where(field, "ilike", `${filter.value}`);
                break;
              } else {
                builder.where(field, "=", filter.value);
              }
              break;


            case "gt":
              if (filter.value == "string") {
              } else {
                builder.where(field, ">", filter.value);
              }
              break;


            case "sw":
              if (filter.value == "string") {
              } else {
                builder.where(field, "ilike", `${filter.value}%`);
              }
              break;


            case "cn":
              builder.where(field, "ilike", `%${filter.value}%`);
              break;

              
          }
        });
      })
      .select(
        "employee_id",
        "gender",
        "salary",
        "department",
        "join_date",
        "first_name"
      );
    // console.log(data);
    return data;
  }
  async getManagerIdFromDept(department) {
    try {
      const manID = await db("employee")
        .select("employee_id")
        .where("department", department)
        .where("role", "=", "manager");

      return manID;
    } catch (err) {
      throw new Error("error occurred " + err.message);
    }
  }
  async getDeletedLogs() {
    try {
      const data = await db("log").select("*");
      return data;
    } catch (err) {
      throw new Error("error occurred " + err.message);
    }
  }
  async getAdmin(department) {
    try {
      const data = await db("employee")
        .where("department", department)
        .whereNull("manager_id");
      return data;
    } catch (err) {
      throw new Error("error occurred " + err.message);
    }
  }
  async getManager(id, department) {
    try {
      const data = await db("employee")
        .where("employee_id", id)
        .where("department", department)
        .where("role", "=", "manager");
      return data;
    } catch (err) {
      throw new Error("error occurred " + err.message);
    }
  }
  async getManagerFromDept(department) {
    try {
      const data = await db("employee")
        .where("department", department)
        .whereNull("manager_id");
      return data;
    } catch (err) {
      throw new Error("error occurred" + err.message);
    }
  }
  async getUserDept(department) {
    try {
      const data = await db("employee").where({ department: department });
      return data;
    } catch (err) {
      throw new Error("error occured" + err.message);
    }
  }
}

module.exports = new UserDAO();
