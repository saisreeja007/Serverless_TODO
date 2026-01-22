import { deleteTodo } from '../../businessLogic/todos.mjs'

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const userId = event.requestContext.authorizer.principalId

  await deleteTodo(userId, todoId)

  return {
    statusCode: 200,
    body: ''
  }
}