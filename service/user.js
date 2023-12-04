const personDAO = require("../dao/user");
const { hashPassword } = require("./bcryptService");
const zxcvbn = require("zxcvbn");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
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
    location
  ) {
    try {
      const passwordStrength = zxcvbn(password);
      if (passwordStrength.score < 2) {
        const error = new Error(errorMessages.WEAK_PASSWORD);
        error.statusCode = 400; // Set the status code
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
        location
      );
    } catch (err) {
      throw new Error("error occured " + err.message);
    }
  }
  async createManager(managerDetails) {
    const { email, department } = managerDetails;
    return personDAO.createManager(email, department);
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
      }catch (err) {
      throw new Error("error occurred " + err.message);
    }
  }
  async isEmailUniquePost(email){
    try{
      const exists = await personDAO.isEmailUniquePost(email);
      return exists;
    }catch(err){
      throw new Error('new error occurred'+ err.message)
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
      }catch (err) {
      throw new Error("error occurred " + err.message);
    }
  }

  async isDeptUnique(department) {
    try {
      const doesExist = await personDAO.checkForDepartment(department);
      return doesExist;
      }catch (err) {
      throw new Error("error occurred " + err.message);
    }
  }
  async isAdminUnique(adminDepartment) {
    try{
      const doesExist = await personDAO.checkForAdmin(adminDepartment);
      return doesExist;
    }
catch (err) {
      throw new Error("error occurred " + err.message);
    }
  }
  async getDeptCorrespondingManager(manager) {
    try {
      const deptName = await personDAO.getDeptName(manager);
      return deptName;
    } catch (err) {
     console.error('error occurred')
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
  async updateFirstName(newFirstName, email) {
    const fname = await personDAO.updateFirstName(newFirstName, email);
    //yaha par error handle ho sakta hai if newFname=Fname
    return fname;
  }
  async updateLastName(newLastName, email) {
    const lname = await personDAO.updateLastName(newLastName, email);
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
  async deleteManagerByID(oldManagerEID, newMID, newAssignedDepartment,delEmail,delDept) {
    try {
      await personDAO.deleteManagerByIDTransaction(oldManagerEID,newMID,newAssignedDepartment,delEmail,delDept);
    } catch (err) {
      throw new Error("new error occurred " + err.message);
    }
  }
  async getManagerIdFromDept(department){
    try{
      //yaha se shuru karna hai/
      const manID = await personDAO.getManagerIdFromDept(department);
      return manID;
    }catch(err){
    throw new Error('new Erorr occurred'+err.message);
    }
  }
  async fetchpassword(email){
    try{
      const hp = await personDAO.fetchpassword(email);
      return hp;
    }catch(err){
      throw new Error('new Erorr occurred'+err.message);
    }
  }
  async fetchUserByIDParam(id){
  try{
    const user = await personDAO.fetchUserByIDParam(id);
    return user;
  }catch(err){
    throw new Error('new error occurred'+err.message);
  }
  }
  async getDeletedLogs(){
    try{
      const user = await personDAO.getDeletedLogs();
      return user;
    }catch(err){
      throw new Error('new error occurred'+err.message);
    }
  }
}

module.exports = new UserService();
