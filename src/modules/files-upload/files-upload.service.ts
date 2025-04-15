import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import * as path from 'path';
import { InjectConfig } from '@common/decorators/inject-config.decorator';
import { S3 } from '@common/helpers/s3';
import { AWSConfig, AWSConfigType } from '@core/aws/aws.config';
import { OperationApisWrapper } from 'modules/operation-apis/operation-apis-wrapper';

@Injectable()
export class FilesUploadService {
  S3: S3;
  constructor(
    @InjectConfig(AWSConfig)
    private readonly AWSConfigFactory: AWSConfigType,
    private readonly operationApis: OperationApisWrapper,
  ) {
    this.S3 = new S3(
      this.AWSConfigFactory.accessKeyId,
      this.AWSConfigFactory.secretAccessKey,
      this.AWSConfigFactory.region,
    );
  }

  ingestFileUpload(token, result, companyId, fileName) {
    try {
      this.operationApis.ingest(token, {
        files: [{ file_name: fileName, file_path: result.key }],
        companyId: companyId,
      });
    } catch (error) {
      console.log('error', error);
    }
  }

  /**
   * Upload a file using the fileStream object
   *
   * @param {Object} file file object from form data, must have mimetype and buffer
   * @param {String} pathPrefix pathPrefix to create virtual directories
   */
  async fileUpload(
    file,
    pathPrefix = '',
    isPrivate = false,
    token = null,
    companyId = null,
  ) {
    try {
      // create file name using random timestamp in directory of user
      const fileExtName = path.extname(file.originalname);
      const fileName = `${pathPrefix ? `${pathPrefix}/` : ''}${new Date()
        .getTime()
        .toString()}-${file.originalname}`;

      const result = await this.S3.upload(
        this.AWSConfigFactory.bucketName,
        fileName,
        file.buffer,
        file.mimetype,
        isPrivate,
      );
      if (token) {
        this.ingestFileUpload(token, result, companyId, file.originalname);
      }
      return {
        originalname: file.originalname || 'Unknown',
        url: result.Location,
        key: result.Key,
        mimetype: file.mimetype,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * get url for private file using a fileurl
   *
   * @param {Object} file file url
   */
  async getPrivateFileUrl(fileurl, expiry = 60 * 30) {
    try {
      const result = await this.S3.privateSignedUrl(
        this.AWSConfigFactory.bucketName,
        fileurl,
        expiry,
      );

      return {
        result,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a file using the fileStream object
   *
   * @param {Object} file file url must valid s3 url
   */
  async fileDelete(fileurl) {
    try {
      const result = await this.S3.deleteFile(
        this.AWSConfigFactory.bucketName,
        fileurl,
      );
      return {
        ...result,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload multiple files
   * @param {Array} files file object from form data, must have mimetype and buffer
   * @param {String} pathPrefix pathPrefix to create virtual directories
   */
  async multiFileUpload(
    files = [],
    pathPrefix = '',
    isPrivate = false,
    token = null,
    companyId = null,
  ) {
    try {
      const uploadStatus = [];
      await Promise.all(
        files.map(async (file, index) => {
          try {
            const result = await this.fileUpload(
              file,
              pathPrefix,
              isPrivate,
              token,
              companyId,
            );
            uploadStatus.push({
              ...result,
              buffer: file.buffer.toString('base64'),
              index,
              isFailed: false,
            });
          } catch (error) {
            uploadStatus.push({
              originalname: file.originalname || 'Unknown',
              url: null,
              key: null,
              index,
              isFailed: true,
              error: error.message,
            });
          }
        }),
      );

      return uploadStatus;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload multiple files
   * @param {Array} files file object from form data, must have mimetype and buffer
   * @param {String} pathPrefix pathPrefix to create virtual directories
   */
  async multiFilesDelete(fileUrls = []) {
    try {
      await Promise.all(
        fileUrls.map(async (url) => {
          await this.fileDelete(url);
        }),
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  async getAudioBuffer(fileurl) {
    try {
      return await this.S3.getAudioBufferFromS3(
        this.AWSConfigFactory.bucketName,
        fileurl,
      );
    } catch (error) {
      throw error;
    }
  }
}
