import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import {
  cloneDeep
  // forEach
} from 'lodash'

const createNew = async (reqBody) => {
  // eslint-disable-next-line no-useless-catch
  try {
    // Xử lý logic dữ liệu tuỳ đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Gọi tới tâng Model để xử lý lưu bản ghi newBoard vào trong Database
    const createdBoard = await boardModel.createNew(newBoard)
    // console.log(createdBoard)

    // Lấy bản ghi board sau khi gọi (tuỳ vào mục đích dự án có bước này hay không)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
    // console.log(getNewBoard)

    // Làm thêm các xử lý logic khác với các Collection khác tuỳ đặc thù dự án...
    // Bắn email, notification về cho admin khi có 1 board mới được tạo

    // Trả kết quả về trong Service luôn phải có return
    return getNewBoard
  } catch (error) { throw error }
}

const getDetails = async (boardId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    // B1: Deep clone board ra một cái mới để xử lý, không ảnh hưởng đến board ban đầu, tuỳ mục đích về sau có cần clone deep hay không (video 63)
    const resBoard = cloneDeep(board)
    // B2: Đưa card về đúng column của nó
    resBoard.columns.forEach(column => {
      // Cách dùng .equals là vì chúng hiểu ObjectId trong MongoDB có hỗ trợ method .equals
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))

      // // Cách khác đơn giản là convert ObjectId về String bằng hàm toString() của JavaScript
      // column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
    })

    // B3: Xoá mảng card khỏi board ban đầu
    delete resBoard.cards

    return resBoard
  } catch (error) { throw error }
}

export const boardService = {
  createNew, getDetails
}
