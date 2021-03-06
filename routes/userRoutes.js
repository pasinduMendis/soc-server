const express = require('express')
const userRoutes = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

userRoutes.get('/', async (req, res) => {
  console.log("abc")
  res.send("done")
})

userRoutes.post('/add', async (req, res) => {
  const user = new User(req.body)
  const check = await User.findOne({ email: user.email })
  if (check == null) {
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    user
      .save()
      .then((result) => {
        console.log(result)
        res.json('successfully registered')
      })
      .catch((err) => console.log(err))
  } else {
    res.json('already registered')
  }
})

userRoutes.get('/check/:email/:password', async (req, res) => {
  const findId = await User.findOne({
    email: req.params.email,
    //admin_password: req.params.password,
  })
  var validPassword=false
  {findId?validPassword = await bcrypt.compare(
    req.params.password,
    findId?.password
  ):validPassword=false}
  if (validPassword) {
    var token = jwt.sign({ user:findId }, "Abcd!23234", {});
    console.log(token)
    res.send(token)
  } else {
    res.send('incorrect')
  }
})

userRoutes.get('/check2/:email', async (req, res) => {
  const findId = await User.findOne({
    email: req.params.email,
    //admin_password: req.params.password,
  })

  res.send(findId)
})

userRoutes.put('/update/:email', async (req, res) => {
  const salt = await bcrypt.genSalt(10)
    const pass = await bcrypt.hash(req.body.password, salt)
    const password={password:pass} 
/*     console.log(req.body) */
  const updateId = await User.updateOne(
    { email: req.params.email },
    { $set: password }
  )
  res.send(updateId?'success':'failed')
})

userRoutes.post('/getData', async (req, res) => {
  var decoded = jwt.verify(req.body.token, "Abcd!23234");
  res.send(decoded)
})

module.exports = userRoutes
