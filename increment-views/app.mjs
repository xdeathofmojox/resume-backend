/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: process.env.REGION });
const docClient = DynamoDBDocumentClient.from(client);

const params = {
    TableName: process.env.TABLE_NAME,
    Key:{
        id: 'view_counter'
    },
    UpdateExpression: "ADD #views :increase",
    ExpressionAttributeNames: {
        "#views": "views"
    },
    ExpressionAttributeValues: {
        ":increase": 1
    },
    ReturnValues: "UPDATED_NEW"
}

const command = new UpdateCommand(params);

export const lambdaHandler = async (event, context) => {
    try {
        const response = await docClient.send(command);
        console.log(response);
        return {
            'statusCode': 200,
            'body': {
                'views': response['Attributes']['views']
            }
        }
    } catch (err) {
        console.log(err);
        return err;
    }
};
