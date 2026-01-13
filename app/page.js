'use server';

import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand , ScanCommand} from "@aws-sdk/lib-dynamodb";


const AWS_REGION = process.env.AMPLIFY_AWS_DEFAULT_REGION || 'ap-south-1';
const secretsManager = new SecretsManagerClient({ region: AWS_REGION });
const dynamoClient = new DynamoDBClient({ region: AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient, {
  marshallOptions: { removeUndefinedValues: true },
});


export async function getTableNameFromSecrets() {
  try {
    const command = new GetSecretValueCommand({
      SecretId: "secretsone",
    });

    const response = await secretsManager.send(command);
    const secrets = JSON.parse(response.SecretString || "{}");

    
    const tableName = secrets.MUSIC_TABLE_NAME || secrets.DYNAMODB_TABLE_NAME;
    console.log(tableName);
    if (!tableName) {
      throw new Error("Table name not found in secrets");
    }

    return tableName;
  } catch (error) {
    console.error("Error retrieving table name from Secrets Manager:", error);
    throw new Error("Failed to retrieve table name from secrets");
  }
}
console.log("debug");


export default async function getAllMusicItem() {
  try {
    const tableName = await getTableNameFromSecrets();
    
    const command = new ScanCommand({
      TableName: tableName,
    });

    console.log("Scanning DynamoDB table...");
    const response = await docClient.send(command);
    
    console.log(`Successfully retrieved ${response.Items?.length || 0} items`);
    return {
      success: true,
      data: response.Items || [],
      count: response.Count || 0
    };
  } catch (error) {
    console.error("Error retrieving music items from DynamoDB:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: []
    };
  }
}
