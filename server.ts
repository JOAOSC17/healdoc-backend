import express from 'express'
import UserRoutes from './routes/UserRoutes'
const app = express()

app.use(express.json())
app.use(express.urlencoded())
app.use('/users', UserRoutes)
const PORT: number = process.env.PORT as unknown as number || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port |${PORT}|`)
})
