const db = require("../db/db");
const user = require("../service/user");

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
  async createManager(email, department) {
    try {
      const managerId = this.generateRandomFiveDigitNumber();
      const [mid] = await db("manager")
        .insert({
          manager_id: managerId,
          email: email,
          department: department,
        })
        .returning("manager_id");
      return mid;
    } catch (err) {
      throw new Error("Error occurred" + err.message);
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await db("employee").where({ email: email }).first();
      const {password,...withoutpassword} = user;
      console.log(withoutpassword)
      return withoutpassword;
    } catch (err) {
      throw new Error("Error occurred" + err.message);
    }
  }
  async isEmailUniquePost(email){
    try{
      const user = await db("employee").where({email:email});
      return user
    }catch(err){
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
  async fetchpassword(email){
    try{
      const hp = await db("employee").where("email", email).first();
      const {password,...withoutpassword} = hp;
      return password;
    }catch(err){
      throw new Error("Error occurred" + err.message);
    }
  }

  async checkForManager(email) {
    try {
      const existingManager = await db("manager").where("email", email).first();
      return existingManager;
    } catch (err) {
      throw new Error("Error occurred" + err.message);
    }
  }
  async checkForDepartment(department) {
    try {
      const existingDepartment = await db("manager")
        .where("department", department)
        .first();
      return existingDepartment;
    } catch (err) {
      throw new Error("Error occurred" + err.message);
    }
  }
  async checkForAdmin(adminDepartment) {
    try {
      const existingAdmin = await db("manager")
        .where("department", adminDepartment)
        .first();
      return existingAdmin;
    } catch (err) {
      throw new Error("Error occurred" + err.message);
    }
  }
  async getDeptName(manager) {
    try {
      const managerDept = await db("manager")
        .select("department")
        .where("manager_id", manager)
        .first();

      return managerDept;
    } catch (err) {
      throw new Error("Error occurred" + err.message);
    }
  }
  generateRandomFiveDigitNumber() {
    const min = 10000; // Smallest 5-digit number
    const max = 99999; // Largest 5-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
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
  async fetchUserByIDParam(id){
    const query  = await db("employee").where("employee_id",id).first();
    const {password,...withoutpassword} = query;
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
  async updateFirstName(newFirstName, email) {
    const result = await db("employee")
      .where("email", email)
      .update({ first_name: newFirstName });
    return result;
  }
  async updateLastName(newLastName, email) {
    const result = await db("employee")
      .where("email", email)
      .update({ last_name: newLastName });
    return result;
  }
  async updateAddress(newAddress, email) {
    const result = await db("employee")
      .where("email", email)
      .update({ address: newAddress });
    return result;
  }
  async updatePhone(newPhone, email) {
    const result = await db("employee")
      .where("email", email)
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
        .where('employee_id',id);
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

  
  async deleteManagerByIDTransaction(
    oldMEID,
    newMID,
    newDepartment,
    delEmail,
    delDept,
  ) {
    return db.transaction(async (trx) => {
      try {
        await db("employee")
          .transacting(trx)
          .where("employee_id", oldMEID).del()

        await db("manager")
        .transacting(trx)
        .where("email",delEmail).del()

        await db("employee")
          .transacting(trx)
          .where("department", delDept)
          .update({
            manager_id:newMID,
            department:newDepartment,
          })
      } catch (err) {
        await trx.rollback(err);
        throw err;
      }
    });
  }



  async getManagerIdFromDept(departmemnt) {
    try {
      const manID = await db("manager")
        .select("manager_id")
        .where("department", departmemnt)
        .first();
      return manID;
    } catch (err) {
      throw new Error("error occurred " + err.message);
    }
  }
  async getDeletedLogs(){
    try{
      const data = await db("log").select('*');
      return data;
    }catch(err){
      throw new Error("error occurred " + err.message);
    }
  }
}

module.exports = new UserDAO();
