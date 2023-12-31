 try {
    const userloggedInRole = req.user.role;
    if (userloggedInRole !== "admin") {
      return res.status(401).json({
        validationError: "UNAUTHORIZED",
        msg: errorMessages.UNAUTHORIZED,
      });
    }
    const employeeDataArray = req.body; // Assuming an array of employee data


    await db.transaction(async (trx) => {
      const results = [];
      const validationErrors = [];

      for (const employeeData of employeeDataArray) {
        const validationArr = await performEmployeeValidation(employeeData);
        if (validationArr.length > 0) {
          validationErrors.push({
            employeeData,
            errors: validationArr,
          });
          continue;
        }



          // updation

        if ("id" in employeeData) {
          if ("firstName" in employeeData) {
            await UserService.updateFirstName(
              employeeData.firstName,
              employeeData.id
            );
          }
          if ("lastName" in employeeData) {
            await UserService.updateLastName(
              employeeData.lastName,
              employeeData.id
            );
          }
          if ("phone" in employeeData) {
            await UserService.updatePhone(employeeData.phone, employeeData.id);
          }
          if ("address" in employeeData) {
            await UserService.updateAddress(
              employeeData.address,
              employeeData.id
            );
          }
          results.push({
            id: employeeData.id,
            message: "Employee successfully processed!",
          });
        }
        
        
        
        
        
        //creation
        else {
          const firstName = employeeData.firstName;
          const lastName = employeeData.lastName;
          const dob = employeeData.dob;
          const gender = employeeData.gender;
          const email = employeeData.email;
          const department = employeeData.department;
          const manager = employeeData.manager;
          const address = employeeData.address;
          const password = employeeData.password;
          const role = employeeData.role;
          const phone = employeeData.phone;
          const salary = employeeData.salary;
          const latitude = employeeData.latitude;
          const longitude = employeeData.longitude;
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
          results.push({
            id,
            message: "Employee successfully processed!",
          });
        }
      }


      await trx.commit();
      res.status(201).json({
        msg: "Bulk upsert successfully completed!",
        results,
        validationErrors,
      });
    });
  }