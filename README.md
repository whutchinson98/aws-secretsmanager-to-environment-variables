# AWS Secrets Manager to Environment Variables

Converts all the values from provided AWS SecretsManager secrets to environment
variables to be used in your github workflows.

## Inputs

### `aws-access-key-id`

The aws access key id for the user you will be using to read the secret values.

### `aws-secret-access-key`

The aws secret access key for the user you will be using to read the secret values.

### `aws-region`

The aws region of the secrets you are uploading. Defaults to `us-east-1`.

### `secret-names`

A comma delimited list of your AWS SecretsManager secrets whose values you want
to be put into the github actions environment. They can be plaintext or JSON.


**note on plain text secrets** they key for the environment variable will be
the secret name.

## Outputs

### `success`

If the job was successful or not.

## Example usage

```yaml
- name: before
  # Outputs nothing since it has not been set yet
  run: echo ${{ env.test }}
- uses: whutchinson98/aws-secretsmanager-to-environment-variables@latest
  with:
    aws-access-key-id: 'AWS ACCESS KEY ID'
    aws-secret-access-key: 'AWS SECRET ACCESS KEY'
    aws-region: 'us-east-1'
- name: after
  # Outputs a value! (Assuming a secret you passed in has the key `test`)
  run: echo "${{ env.test }} or $test"
```
