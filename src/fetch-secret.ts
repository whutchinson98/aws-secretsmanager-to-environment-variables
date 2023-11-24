import {
  GetSecretValueCommand,
  GetSecretValueCommandOutput,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import * as core from '@actions/core';

/**
 * @description SecretFetcher is able to fetch your secrets and return them
 * in a convient format to be set as environment variables for your GitHub workflow
 */
export class SecretFetcher {
  private secretsManagerClient: SecretsManagerClient;
  private evironmentVariableKeys: Set<string>;
  secrets: GetSecretValueCommandOutput[];

  constructor({
    awsAccessKeyId,
    awsSecretKey,
    region,
  }: {
    awsAccessKeyId: string;
    awsSecretKey: string;
    region: string;
  }) {
    this.secretsManagerClient = new SecretsManagerClient({
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretKey,
      },
      region,
    });
    this.secrets = [];
    this.evironmentVariableKeys = new Set();
  }

  /**
   * @description Loads in the secret values from a given list
   * @throws {Error} If an error occurs while fetching the secret values
   */
  async loadSecretValues(secrets: string[]) {
    const secretValues: Promise<GetSecretValueCommandOutput>[] = secrets.map(
      secret =>
        this.secretsManagerClient.send(
          new GetSecretValueCommand({
            SecretId: secret,
          }),
        ),
    );

    this.secrets = await Promise.all(secretValues);
  }

  /**
   * @description Updates the github environment with the secret values
   * @throws {Error} If a secret was not found
   */
  exportSecrets() {
    for (const secret of this.secrets) {
      if (!secret.SecretString || !secret.Name) {
        throw new Error(`Secret ${secret.Name} not found`);
      }
      let isJSON: boolean;
      let parsedSecretValue: { [name: string]: string };
      // attempt to parse the secret string into a json
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        parsedSecretValue = JSON.parse(secret.SecretString);
        isJSON = true;
      } catch (err) {
        parsedSecretValue = {};
        isJSON = false;
      }
      // If the secret string is a json we export all key/value pairs to the
      // github environment
      if (isJSON) {
        for (const key in parsedSecretValue) {
          if (this.evironmentVariableKeys.has(key.toLowerCase())) {
            core.warning(
              `Environment variable with key ${key.toLowerCase()} is being overwritten`,
            );
          }
          this.evironmentVariableKeys.add(key.toLowerCase());
          core.exportVariable(key.toLowerCase(), parsedSecretValue[key]);
        }
        // The secret string is not a json so we simply export the secret
      } else {
        if (this.evironmentVariableKeys.has(secret.Name.toLowerCase())) {
          core.warning(
            `Environment variable with key ${secret.Name.toLowerCase()} is being overwritten`,
          );
        }
        this.evironmentVariableKeys.add(secret.Name.toLowerCase());
        core.exportVariable(secret.Name.toLowerCase(), secret.SecretString);
      }
    }
  }
}
