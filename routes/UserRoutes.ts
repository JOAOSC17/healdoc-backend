import { PrismaClient } from '@prisma/client'
import express from 'express'
import { type newUser } from '../models/UserModel'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { APP_SECRET } from '../utils/auth'
const route = express.Router()
const { users } = new PrismaClient()
route.post('/register', async (req, res) => {
  try {
    const { name, age, email, password: passwordString }: newUser = req.body
    if (!name) return res.status(400).json('Name is required')
    if (!age) return res.status(400).json('Age is required')
    if (!email) return res.status(400).json('Email is required')
    const emailHasBeenUsed = await users.findUnique({
      where: {
        email
      }
    })
    if (emailHasBeenUsed) return res.status(403).json('Email has been used by another person')
    if (!passwordString) return res.status(400).json('Password is required')
    const password = await bcrypt.hash(passwordString, 10)
    const newUser = await users.create({
      data: { name, age, email, password }
    })

    const token = jwt.sign({ userId: newUser.id }, APP_SECRET)
    console.log(newUser)
    res.status(200).json({
      token,
      newUser
    })
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})
route.post('/login', async (req, res) => {
  try {
    const { email, password }: newUser = req.body
    if (!email) return res.status(400).json('Email is required')
    const user = await users.findUnique({
      where: {
        email
      }
    })
    if (!user) return res.status(403).json("Email hasn't been resgistered")
    if (!password) return res.status(400).json('Password is required')
    const valid = await bcrypt.compare(
      password,
      user.password
    )
    if (!valid) {
      throw new Error('Invalid password')
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    res.status(200).json({
      token,
      user
    })
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
})
export default route
