'use server';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

// Initialize the Secrets Manager client once
const secretsManager = new SecretsManagerClient({ 
  region: process.env.AWS_REGION || 'us-east-1' // Replace with your region
});


export default async function getEmailCredentials() {
  try {
    const command = new GetSecretValueCommand({
      SecretId: "replicate-nectjs-env",
    });
    const response = await secretsManager.send(command);
    return JSON.stringify(response.SecretString);
  } catch (error) {
    console.error("Error retrieving secrets:", error);
    throw new Error("Failed to retrieve secret credentials");
  }
}
