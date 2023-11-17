# AWS Secrets Manager to Environment Variables

Converts all the values from provided AWS SecretsManager secrets to environment
variables to be used in your github workflows.

## Inputs

## Outputs

## Example usage

```yaml
- name: before
  # Outputs nothing since it has not been set yet
  run: echo ${{ env.test }}
- uses: whutchinson98/aws-secretsmanager-to-environment-variables@latest
  secrets:
    aws-access-key-id: 'AWS ACCESS KEY ID'
    aws-secret-access-key: 'AWS SECRET ACCESS KEY'
- name: after
  # Outputs a value! (Assuming a secret you passed in has the key `test`)
  run: echo ${{ env.test }}
```
