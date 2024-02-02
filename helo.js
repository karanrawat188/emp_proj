async function createUser(
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
      // Retry logic for database operation
      const [id] = await retry(() =>
          db("employee")
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
              .returning("employee_id")
      );

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

      // Retry logic for Elasticsearch
      await retry(() => client.index({
          index: indexName,
          body: documentData,
          id: id.employee_id,
      }));

      // Retry logic for Redis
      const key = `user:${email}`;
      await retry(() => rclient.set(key, JSON.stringify(documentData)));
      await retry(() => rclient.expire(key, 24 * 60 * 60));

      console.log("Document inserted:", documentData);
      console.log("Saved in cache...");

      return id;
  } catch (err) {
      console.error("Error occurred:", err.message);
      throw new Error("Failed to create user. Check logs for details.");
  }
}

// Retry function with exponential backoff
async function retry(operation, maxRetries = 3, retryDelay = 1000) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
          return await operation();
      } catch (error) {
          console.error(`Error: ${error.message}`);
          console.log(`Retrying in ${retryDelay / 1000} seconds...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
  }
  throw new Error("Max retries reached. Operation failed.");
}
