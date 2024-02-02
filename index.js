const express = require("express");
const client = require("./es_config");
const app = express();
const authRoutes = require("./router/authRoutes");
const updateRoutes = require("./router/updateRoutes");
const queryParamsRoutes = require("./router/queryParamsRoutes");
const deleteRoutes = require("./router/deleteRoutes");

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authRoutes);
app.use("/update", updateRoutes);
app.use("/filter", queryParamsRoutes);
app.use("/delete", deleteRoutes);
app.get("/", async (req, res) => {
  const data = await client.search({
    index: "employee",
    query: {
      match_all: {},
    },
  });
  const result = data.hits.hits;
  let arr = result.map((ele)=>{
    delete ele._source.password
    return ele._source
  })
  console.log('output is',arr)
  return res.json({
    msg: arr
  });
});
app.listen(process.env.PORT, () => {
  console.log(`server is listening at port ${process.env.PORT}`);
});


