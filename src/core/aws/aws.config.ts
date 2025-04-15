import { ConfigType, registerAs } from '@nestjs/config';

export interface AwsConfigInterface {
  bucketName: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketUrl: string;
  region: string;
}

export const AWS_CONFIG = 'AWS_CONFIG';

export const AWSConfig = registerAs<AwsConfigInterface>(AWS_CONFIG, () => {
  const {
    env: {
      AWS_S3_BUCKET_NAME,
      AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY,
      AWS_S3_BUCKET_URL,
      AWS_S3_REGION,
    },
  } = process;

  return {
    bucketName: AWS_S3_BUCKET_NAME,
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    bucketUrl: AWS_S3_BUCKET_URL,
    region: AWS_S3_REGION,
  };
});
export type AWSConfigType = ConfigType<typeof AWSConfig>;
