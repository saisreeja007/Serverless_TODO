import { updateTodo } from '../../businessLogic/todos.mjs'

export async function handler(event) {
  const todoId = event.pathParameters.todoId
  const body = JSON.parse(event.body)
  const userId = event.requestContext.authorizer.principalId

  if (
    body.name === undefined ||
    body.dueDate === undefined ||
    body.done === undefined
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid update data' })
    }
  }

  await updateTodo(userId, todoId, body)

  return {
    statusCode: 200,
    body: ''
  }
}


