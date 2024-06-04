/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoutes } from './boardRoutes'

const Router = express.Router()

// Check API v1 status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ statusMessage: 'API v1 are ready to use', code: StatusCodes.OK })
})

// Sử dụng lại boardAPI
Router.use('/boards', boardRoutes)

export const APIs_v1 = Router