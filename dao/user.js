const db = require("../db/db");
const user = require("../service/user");
const { DateTime } = require("luxon");
const client = require("../es_config");

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
    location,
    join_date
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
          join_date: join_date,
        })
        .returning("employee_id");

      const indexName = "employee";
      const documentData = {
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
        join_date: join_date,
        employe_id: id.employee_id,
      };
      const response = await client.index({
        index: indexName,
        body: documentData,
        id: id.employee_id,
      });

      console.log("Document inserted:", response);

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
    const body = {
      query: {
        bool: {
          must: [],
        },
      },
      _source: [
        "first_name",
        "last_name",
        "address",
        "phone",
        "email",
        "location",
        "salary",
        "join_date",
        "location",
        "employe_id",
        "role",
      ],
    };

    Object.entries(userFilter).forEach(([field, filter]) => {
      switch (filter.operator) {
        case "gte":
          body.query.bool.must.push({
            range: {
              [field]: {
                gte: filter.value,
              },
            },
          });
          break;

        case "lte":
          body.query.bool.must.push({
            range: {
              [field]: {
                lte: filter.value,
              },
            },
          });
          break;

        case "cn":
          body.query.bool.must.push({
            wildcard: {
              [field]: {
                value: `*${filter.value}*`,
              },
            },
          });
          break;

        case "eq":
          body.query.bool.must.push({
            match: {
              [field]: filter.value,
            },
          });
          break;
        case "near":
          body.query.bool.must.push({
            term: {
              role: "employee",
            },
            term: {
              department: filter.value.dept,
            },
          });

          body.query.bool.must.push({
            geo_distance: {
              distance: `${filter.value.dist}km`,
              location: {
                lat: parseFloat(filter.value.latitude),
                lon: parseFloat(filter.value.longitude),
              },
            },
          });
          break;
      }
    });
    const ans = await client.search({
      index: "employee",
      body: body,
    });
    console.log("Elasticsearch Response:", ans.hits.hits);
    // return data.hits.hits.map(hit => hit._source);
    const res = ans.hits.hits.map((ele) => {
      return ele._source;
    });
    return res;

    // const data = await db("employee")
    //   .where((builder) => {
    //     Object.entries(userFilter).forEach(([field, filter]) => {
    //       switch (filter.operator) {
    //         case "eq":
    //           if (filter.value == "string") {
    //             builder.where(field, "ilike", `${filter.value}`);
    //             break;
    //           } else {
    //             builder.where(field, "=", filter.value);
    //           }
    //           break;

    //         case "gt":
    //           if (filter.value == "string") {
    //           } else {
    //             builder.where(field, ">", filter.value);
    //           }
    //           break;

    //         case "sw":
    //           if (filter.value == "string") {
    //           } else {
    //             builder.where(field, "ilike", `${filter.value}%`);
    //           }
    //           break;

    //         case "cn":
    //           builder.where(field, "ilike", `%${filter.value}%`);
    //           break;
    //       }
    //     });
    //   })
    //   .select(
    //     "employee_id",
    //     "gender",
    //     "salary",
    //     "department",
    //     "join_date",
    //     "first_name"
    //   );
    // // console.log(data);
    // return data;
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
  async getUserByEmailELK(email) {
    try {
      const data = await client.search({
        index: "employee",
        body: {
          query: {
            term: {
              email: email,
            },
          },
          _source: [
            "first_name",
            "last_name",
            "employe_id",
            "email",
            "address",
            "location",
            "role",
            "department",
            "gender",
            "dob",
            "phone",
            "join_date",
            "salary",
            "manager_id",
          ],
        },
      });
      return data.hits.hits[0]._source;
    } catch (err) {
      throw new Error("error occured" + err.message);
    }
  }
  async isEmailUniqueELK(email) {
    try {
      const data = await client.search({
        index: "employee",
        body: {
          query: {
            term: {
              email: email,
            },
          },
          _source: ["first_name"],
        },
      });
      return data.hits.hits[0];
    } catch (err) {
      throw new Error("error occured" + err.message);
    }
  }
  async fetchpasswordELK(email) {
    try {
      const data = await client.search({
        index: "employee",
        body: {
          query: {
            term: {
              email: email,
            },
          },
          _source: ["password"],
        },
      });
      return data.hits.hits[0]._source.password;
    } catch (err) {
      throw new Error("error occured" + err.message);
    }
  }
  async fetchDataFromELK(email){
    try {
      const data = await client.search({
        index: "employee",
        body: {
          query: {
            term: {
              email: email,
            },
          }
        },
      });
      return data.hits.hits[0]._source;
    } catch (err) {
      throw new Error("error occured" + err.message);
    }
  }
}

module.exports = new UserDAO();
