import AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

export class TodosAccess {
  constructor() {
    this.client = new XAWS.DynamoDB.DocumentClient()
    this.todosTable = process.env.TODOS_TABLE
    this.index = process.env.TODOS_CREATED_AT_INDEX
  }

  async getTodosForUser(userId) {
    const result = await this.client.query({
      TableName: this.todosTable,
      IndexName: this.index,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise()

    return result.Items
  }

  async createTodo(item) {
    await this.client.put({
      TableName: this.todosTable,
      Item: item
    }).promise()

    return item
  }

  async updateTodo(userId, todoId, updatedTodo) {
    await this.client.update({
      TableName: this.todosTable,
      Key: { userId, todoId },
      UpdateExpression: 'set #n = :n, dueDate = :d, done = :done',
      ExpressionAttributeNames: { '#n': 'name' },
      ExpressionAttributeValues: {
        ':n': updatedTodo.name,
        ':d': updatedTodo.dueDate,
        ':done': updatedTodo.done
      }
    }).promise()
  }

  async deleteTodo(userId, todoId) {
    await this.client.delete({
      TableName: this.todosTable,
      Key: { userId, todoId }
    }).promise()
  }

  async updateAttachmentUrl(userId, todoId, attachmentUrl) {
    await this.client.update({
      TableName: this.todosTable,
      Key: { userId, todoId },
      UpdateExpression: 'set attachmentUrl = :url',
      ExpressionAttributeValues: {
        ':url': attachmentUrl
      }
    }).promise()
  }
}

