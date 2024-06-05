/* eslint-disable no-console */
/**
 * Updated by trungquandev.com's author on August 17 2023
 * YouTube: https://youtube.com/@trungquandev
 * "A bit of fragrance clings to the hand that gives flowers!"
 */

import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from '~/config/mongodb'
import { env } from '~/config/environment'
import { APIs_v1 } from '~/routes/v1'

const START_SERVER = () => {
  const app = express()

  // Enable receiving JSON request from data
  app.use(express.json())

  // Sử dụng API v1
  app.use('/v1', APIs_v1)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`3. Server by ${env.AUTHOR} is now running at: http://${env.APP_HOST}:${env.APP_PORT}/`)
  })

  // Thực hiện các tác vụ cleanup trước khi close
  exitHook(() => {
    console.log('4. Server is shutting down')
    CLOSE_DB()
    console.log('5. Disconnected from MongoDB Cloud Atlas')
  })
}

// Chỉ khi kết nối tới database thành công thì mới start server
// Immediately-Invoked / Anonymous Async Function
(async () => {
  try {
    console.log('1. Connecting to MongoDB Cloud Atlas!')
    await CONNECT_DB()
    console.log('2. Connected to MongoDB Cloud Atlas!')

    // Khởi động server backend sau khi connect database thành công
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// // Chỉ khi kết nối tới database thành công thì mới start server
// console.log('1. Connecting to MongoDB Cloud Atlas!')
// CONNECT_DB()
//   .then(() => console.log('2. Connected to MongoDB Cloud Atlas!'))
//   .then(() => START_SERVER())
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })
