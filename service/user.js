const personDAO = require("../dao/user");
const { hashPassword } = require("./bcryptService");
const zxcvbn = require("zxcvbn");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const client = require("../es_config");
const user = require("../dao/user");
const errorMessages = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../errors.json"), "utf-8")
);

class UserService {
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
      const passwordStrength = zxcvbn(password);
      if (passwordStrength.score < 2) {
        const error = new Error(errorMessages.WEAK_PASSWORD);
        error.statusCode = 400;
        throw error;
      }

      // hashing the password
      const hashedpass = await hashPassword(password);
      return personDAO.createUser(
        firstName,
        lastName,
        dob,
        gender,
        email,
        department,
        manager,
        address,
        hashedpass,
        role,
        phone,
        salary,
        location,
        join_date
      );
    } catch (err) {
      throw new Error("error occured " + err.message);
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await personDAO.getUserByEmail(email);
      return user;
    } catch (err) {
      throw new Error("error occcurred " + err.message);
    }
  }

  async isEmailUnique(email) {
    try {
      const exists = await personDAO.isEmailUnique(email);
      return exists;
    } catch (err) {
      throw new Error("error occurred " + err.message);
    }
  }
  async isEmailUniquePost(email) {
    try {
      const exists = await personDAO.isEmailUniquePost(email);
      return exists;
    } catch (err) {
      throw new Error("new error occurred" + err.message);
    }
  }
  async bcryptCompare(password, Userpassword) {
    try {
      const res = await bcrypt.compare(password, Userpassword);
      return res;
    } catch (err) {
      throw new Error("error occurred " + err.message);
    }
  }
  async isManagerUnique(email) {
    try {
      const isUnique = await personDAO.checkForManager(email);
      return isUnique;
    } catch (err) {
      throw new Error("error occurred " + err.message);
    }
  }

  async isDeptUnique(department) {
    try {
      const doesExist = await personDAO.checkForDepartment(department);
      return doesExist;
    } catch (err) {
      throw new Error("error occurred " + err.message);
    }
  }
  async isAdminUnique(adminDepartment) {
    try {
      const doesExist = await personDAO.checkForAdmin(adminDepartment);
      return doesExist;
    } catch (err) {
      throw new Error("error occurred " + err.message);
    }
  }
  async getDeptCorrespondingManager(manager) {
    try {
      const deptName = await personDAO.getDeptName(manager);
      return deptName;
    } catch (err) {
      console.error("error occurred");
    }
  }
  async getUserByDept(department) {
    try {
      const user = await personDAO.getUserDept(department);
      return user;
    } catch (err) {
      console.log(err.message);
    }
  }
  async getAdmin(department) {
    try {
      const user = await personDAO.getAdmin(department);
      return user;
    } catch (err) {
      console.log(err.message);
    }
  }
  async getAllUsers() {
    try {
      const users = await personDAO.getAllUsers();
      console.log(users);
      return users;
    } catch (err) {
      throw new Error("error occurred " + err.message);
    }
  }
  async getManager(id, department) {
    try {
      const users = await personDAO.getManager(id, department);
      return users;
    } catch (err) {
      throw new Error("error occurred" + err.message);
    }
  }
  async getManagerFromDept(department) {
    try {
      const user = await personDAO.getManagerFromDept(department);
      return user;
    } catch (err) {
      throw new Error("error occurred " + err.message);
    }
  }
  async getManagerName(managerId) {
    try {
      const name = await personDAO.getManagerName(managerId);
      if (name) {
        return name;
      }
      const error = new Error(errorMessages.INV_MANAGER_REQ);
      error.statusCode = 400;
      throw error;
    } catch (err) {
      throw new Error("error occurred " + err.message);
    }
  }
  async updateFirstName(newFirstName, id) {
    const fname = await personDAO.updateFirstName(newFirstName, id);
    //yaha par error handle ho sakta hai if newFname=Fname
    return fname;
  }
  async updateLastName(newLastName, id) {
    const lname = await personDAO.updateLastName(newLastName, id);
    return lname;
  }
  async updatePhone(newPhone, email) {
    const phone = await personDAO.updatePhone(newPhone, email);
    return phone;
  }
  async updateAddress(newAddress, email) {
    const address = await personDAO.updateAddress(newAddress, email);
    return address;
  }
  async getUsersQueryParam(namePrefix) {
    try {
      const user = await personDAO.getNameQuery(namePrefix);
      return user;
    } catch (err) {
      throw new Error("new error occurred " + err.message);
    }
  }
  async getUsersBySalaryQueryParam(salaryParam) {
    try {
      const user = await personDAO.getSalaryQuery(salaryParam);
      return user;
    } catch (err) {
      throw new Error("new error occurred " + err.message);
    }
  }
  async getUserByID(id) {
    try {
      const user = await personDAO.getEmployeeByID(id);
      return user;
    } catch (err) {
      throw new Error("new error occurred " + err.message);
    }
  }
  async deleteUserByID(id) {
    try {
      const deleteUser = await personDAO.deleteUserById(id);
      return deleteUser;
    } catch (err) {
      throw new Error("new error occurred " + err.message);
    }
  }
  async storeLog(obj, arr) {
    try {
      await personDAO.storeLogInfo(obj, arr);
    } catch (err) {
      throw new Error("new error occurred " + err.message);
    }
  }
  async deleteManagerByID(newMID, newDepartment, oldMID) {
    try {
      await personDAO.deleteManagerByIDTransaction(
        newMID,
        newDepartment,
        oldMID
      );
    } catch (err) {
      throw new Error("new error occurred " + err.message);
    }
  }
  async getManagerIdFromDept(department) {
    try {
      const manID = await personDAO.getManagerIdFromDept(department);
      return manID;
    } catch (err) {
      throw new Error("new Erorr occurred" + err.message);
    }
  }
  async getUsers(params) {
    try {
      const userFilter = {}; // Construct filter based on queryParams

      if (params.gender) {
        const [operator, value] = params.gender.split(":");
        userFilter.gender = { operator, value };
      }
      if (params.salary) {
        const [operator, value] = params.salary.split(":");
        userFilter.salary = { operator, value };
      }
      if (params.department) {
        const [operator, value] = params.department.split(":");
        userFilter.department = { operator, value };
      }
      if (params.employe_id) {
        const [operator, value] = params.employe_id.split(":");
        userFilter.employe_id = { operator, value };
      }
      if (params.first_name) {
        const [operator, value] = params.first_name.split(":");
        userFilter.first_name = { operator, value };
      }
      if (params.join_date) {
        const [operator, value] = params.join_date.split(":");
        userFilter.join_date = { operator, value };
      }
      if (params.id) {
        const data = await client.get({
          index: "employee",
          id: params.id,
        });
        const obj = data._source;
        if (obj.role !== "manager") {
          throw new Error(" User is not allowed to perform this access");
        }
        console.log(obj)
        const match = obj.location.match(/\(([^ ]+) ([^)]+)\)/);
        const longitude = parseFloat(match[1]);
        const latitude = parseFloat(match[2]);
        const dist = 100;
        const dept =obj.department;
        const pobj = { latitude, longitude, dist,dept};
        userFilter.location = { operator: "near", value: pobj };
      }
      console.log(userFilter)
      return personDAO.getUsersWithFilter(userFilter);
    } catch (err) {
      throw new Error("new error occurred" + err.message);
    }
  }
  async fetchpassword(email) {
    try {
      const hp = await personDAO.fetchpassword(email);
      return hp;
    } catch (err) {
      throw new Error("new Erorr occurred" + err.message);
    }
  }
  async fetchUserByIDParam(id) {
    try {
      const user = await personDAO.fetchUserByIDParam(id);
      return user;
    } catch (err) {
      throw new Error("new error occurred" + err.message);
    }
  }
  async getDeletedLogs() {
    try {
      const user = await personDAO.getDeletedLogs();
      return user;
    } catch (err) {
      throw new Error("new error occurred" + err.message);
    }
  }
  async getUserByEmailELK(email){
   try{
    const user = await personDAO.getUserByEmailELK(email);
    return user;
   }catch(err){
    throw new Error("new error occurred"+ err.message)
   }
  }
  async isEmailUniqueELK(email){
    try{
      const user = await personDAO.isEmailUniqueELK(email);
      return user;
     }catch(err){
      throw new Error("new error occurred"+ err.message)
     }
  }
  async fetchpasswordELK(email){
    try{
      const user = await personDAO.fetchpasswordELK(email);
      return user;
     }catch(err){
      throw new Error("new error occurred"+ err.message)
     } 
  }
  async fetchDataFromELK(email){
    try{
      const user = await personDAO.fetchDataFromELK(email);
      return user;
     }catch(err){
      throw new Error("new error occurred"+ err.message)
     } 
  }
}

module.exports = new UserService();
