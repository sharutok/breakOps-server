const express = require('express')
const app=express()
const cors = require('cors')
const morgan = require('morgan')
const router = require('./Router/Route')
require('dotenv').config('./.env')
// console.log(process.env.CLIENT_ORIGIN);

app.use(cors(
    {
    origin: process.env.CLIENT_ORIGIN
    }
))
app.use(express.json())
app.use(morgan('dev'))

app.use("/api/v1", router)
app.get("/health", async (req, res) => {
    return res.status(200).json("ok")
})

module.exports = app
