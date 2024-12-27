const express = require('express')
const app=express()
const cors = require('cors')
const morgan = require('morgan')
const router = require('./Router/Route')

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use("/api/v1", router)
app.get("/health", async (req, res) => {
    return res.status(200).json("ok")
})

module.exports = app
