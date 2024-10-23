import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { PrismaClient } from '@prisma/client'

import conversationRoutes from './routes/conversationRoutes'
import attachmentRoutes from './routes/attachmentRoutes'
import authRoutes from './routes/authRoutes'

import { authenticateToken } from './middlewares/auth'
import { setupSocketHandlers } from './utils/socketUtils'
import { initializeBucketR2 } from './utils/r2Utils'
import errorHandler from './middlewares/errorHandler'

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)
export const prisma = new PrismaClient()

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/conversations', authenticateToken, conversationRoutes)
app.use('/api/attachments', authenticateToken, attachmentRoutes)

setupSocketHandlers(io)
initializeBucketR2()

app.use(errorHandler)

const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
