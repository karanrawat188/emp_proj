const express = require('express');

const app = express();
const authRoutes= require('./router/authRoutes');
const updateRoutes = require('./router/updateRoutes');
const queryParamsRoutes = require('./router/queryParamsRoutes');
const deleteRoutes= require('./router/deleteRoutes')

require('dotenv').config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authRoutes);
app.use('/update',updateRoutes);
app.use('/filter',queryParamsRoutes);
app.use('/delete',deleteRoutes);


app.listen(process.env.PORT,()=>{
    console.log(`server is listening at port ${process.env.PORT}`)
})
