import { TodosAccess } from '../dataLayer/todosAccess.mjs'
import { createAttachmentPresignedUrl } from '../fileStorage/attachmentUtils.mjs'
import { v4 as uuidv4 } from 'uuid'

const todosAccess = new TodosAccess()

export async function getTodosForUser(userId) {
  return await todosAccess.getTodosForUser(userId)
}

export async function createTodo(userId, newTodo) {
  const todoId = uuidv4()
  const createdAt = new Date().toISOString()

  const item = {
    userId,
    todoId,
    createdAt,
    name: newTodo.name,
    dueDate: newTodo.dueDate,
    done: false
  }

  return await todosAccess.createTodo(item)
}

export async function updateTodo(userId, todoId, updatedTodo) {
  await todosAccess.updateTodo(userId, todoId, updatedTodo)
}

export async function deleteTodo(userId, todoId) {
  await todosAccess.deleteTodo(userId, todoId)
}

export async function createAttachmentPresignedUrlAndSave(todoId, userId) {
  const uploadUrl = await createAttachmentPresignedUrl(todoId)

  const imageUrl = `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${todoId}`

  await todosAccess.updateAttachmentUrl(userId, todoId, imageUrl)

  return uploadUrl
}
