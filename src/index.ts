import * as core from '@actions/core';
import { SecretFetcher } from './fetch-secret';

/**
 * @description Sets up the environment grabbing necessary environment variables etc.
 * @throws {Error} If the environment can not be setup correctly
 * @return {{awsAccessKeyId: string, awsSecretKey, region: string, secrets: string[]}} The environment variables
 */
function setupEnvironment(): {
  awsAccessKeyId: string;
  awsSecretKey: string;
  region: string;
  secrets: string[];
} {
  const awsAccessKeyId = core.getInput('aws-access-key-id', {
    required: true,
    trimWhitespace: true,
  });

  if (!awsAccessKeyId || awsAccessKeyId.length === 0) {
    throw new Error('aws-access-key-id input was not correctly passed in');
  }

  const awsSecretKey = core.getInput('aws-secret-access-key', {
    required: true,
    trimWhitespace: true,
  });

  if (!awsSecretKey || awsSecretKey.length === 0) {
    throw new Error('aws-secret-access-key input was not correctly passed in');
  }

  let region = core.getInput('aws-region', {
    required: true,
    trimWhitespace: true,
  });

  if (!region || region.length === 0) {
    region = 'us-east-1';
  }

  const secrets = core.getInput('secret-names', {
    required: true,
    trimWhitespace: true,
  });

  if (!secrets || secrets.length === 0) {
    throw new Error('secret-names input was not corretly passed in');
  }

  return { awsAccessKeyId, awsSecretKey, region, secrets: secrets.split(',') };
}

async function run() {
  try {
    const { awsAccessKeyId, awsSecretKey, region, secrets } =
      setupEnvironment();
    core.info('Environment setup complete');

    const secretFetcher = new SecretFetcher({
      awsAccessKeyId,
      awsSecretKey,
      region,
    });

    await secretFetcher.loadSecretValues(secrets);
    secretFetcher.exportSecrets();
  } catch (error) {
    core.setFailed(error as Error);
  }
}

// Run the action
// eslint-disable-next-line @typescript-eslint/no-floating-promises
run();
