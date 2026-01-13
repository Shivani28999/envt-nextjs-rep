'use server';

import  getAllMusicItem  from './page.js'; 
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
export default async function getAllMusicItems() {
  try {
    return await getAllMusicItem();
  } catch (error) {
    console.error("Error retrieving music items from DynamoDB:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: []
    };
  }
}