const express = require('express')
const app=express()
const cors = require('cors')
const morgan = require('morgan')
const router = require('./Router/Route')
require('dotenv').config('./.env')

app.use(cors(
    {
    origin: process.env.CLIENT_ORIGIN
    }
))
app.use(express.json())
app.use(morgan('combined'))

app.use("/api/v1", router)
app.get("/health", async (req, res) => {
    return res.status(200).json("ok")
})

module.exports = app
