import { createAttachmentPresignedUrlAndSave } from '../../businessLogic/todos.mjs'

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const userId = event.requestContext.authorizer.principalId

  const uploadUrl = await createAttachmentPresignedUrlAndSave(todoId, userId)

  return {
    statusCode: 200,
    body: JSON.stringify({ uploadUrl })
  }
}