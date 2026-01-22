import AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({ signatureVersion: 'v4' })

const bucketName = process.env.S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export async function createAttachmentPresignedUrl(todoId) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })
}


deltodo
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
