import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { Cache } from 'cache-manager';
import { CacheManager } from './cache-manager';

@Injectable()
export class S3 {
  s3: AWS.S3;
  constructor(accessKeyId, secrectAccessKey, region) {
    this.s3 = new AWS.S3({
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secrectAccessKey,
      },
      region: region,
    });
  }

  /**
   * Upload file to S3
   *
   * @param {String} filename file name
   * @param {Object} data data object for file
   * @param {String} mimeType content mime type
   * @param {Boolean} isPrivate upload file as private
   */
  async upload(
    bucketName: string,
    filename,
    data,
    mimeType,
    isPrivate = false,
  ): Promise<any> {
    try {
      const accessLevel = isPrivate ? 'private' : 'public-read';
      const params = {
        ACL: accessLevel,
        Body: data,
        ContentType: mimeType,
        Bucket: bucketName,
        Key: filename,
      };
      const result = await this.s3.upload(params).promise();
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get signed file url S3
   *
   * @param {String} filename file name
   */
  async privateSignedUrl(
    bucketName: string,
    filename: string,
    expiry = 60 * 30,
  ): Promise<string> {
    try {
      const params = {
        Bucket: bucketName,
        Key: filename,
        Expires: expiry, // time in seconds: e.g. 60 * 5 = 5 mins
      };
      let url: string = await CacheManager.cache.get(filename);
      if (!url) {
        url = this.s3.getSignedUrl('getObject', params);
        await CacheManager.cache.set(filename, url, {
          ttl: expiry - expiry * 0.1,
        });
      }
      return url;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete file to S3
   *
   * @param {String} fileurl fileurl
   */
  async deleteFile(bucketName: string, fileurl) {
    try {
      const params = {
        Bucket: bucketName,
        Key: fileurl,
      };
      const result = await this.s3.deleteObject(params).promise();

      return result;
    } catch (error) {
      throw error;
    }
  }

  async getAudioBufferFromS3(
    bucketName: string,
    filename: string,
  ): Promise<Buffer> {
    const params = {
      Bucket: bucketName,
      Key: filename,
    };

    const { Body } = await this.s3.getObject(params).promise();
    return Body as Buffer; // Cast to Buffer
  }
}
