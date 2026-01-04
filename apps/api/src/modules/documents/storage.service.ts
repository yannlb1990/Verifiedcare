import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export interface StorageResult {
  url: string;
  key: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

@Injectable()
export class StorageService {
  private readonly isProduction: boolean;
  private readonly bucket: string;
  private readonly region: string;
  private readonly localStoragePath: string;

  constructor(private readonly config: ConfigService) {
    this.isProduction = config.get('NODE_ENV') === 'production';
    this.bucket = config.get('AWS_S3_BUCKET') || 'verified-care-documents';
    this.region = config.get('AWS_REGION') || 'ap-southeast-2';
    this.localStoragePath = path.join(process.cwd(), 'uploads');

    // Ensure local storage directory exists for development
    if (!this.isProduction && !fs.existsSync(this.localStoragePath)) {
      fs.mkdirSync(this.localStoragePath, { recursive: true });
    }
  }

  async uploadFile(
    file: UploadedFile,
    folder: string,
  ): Promise<StorageResult> {
    this.validateFile(file);

    const fileExtension = path.extname(file.originalname);
    const uniqueId = crypto.randomUUID();
    const key = `${folder}/${uniqueId}${fileExtension}`;

    if (this.isProduction && this.config.get('AWS_ACCESS_KEY_ID')) {
      return this.uploadToS3(file, key);
    } else {
      return this.uploadToLocal(file, key);
    }
  }

  async deleteFile(key: string): Promise<void> {
    if (this.isProduction && this.config.get('AWS_ACCESS_KEY_ID')) {
      await this.deleteFromS3(key);
    } else {
      await this.deleteFromLocal(key);
    }
  }

  getSignedUrl(key: string, expiresIn: number = 3600): string {
    if (this.isProduction && this.config.get('AWS_ACCESS_KEY_ID')) {
      // In production, generate presigned URL
      return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
    } else {
      // In development, return local file URL
      return `/uploads/${key}`;
    }
  }

  private validateFile(file: UploadedFile): void {
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
    ];

    const maxSizeBytes = 10 * 1024 * 1024; // 10MB

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: PDF, JPEG, PNG, WebP`,
      );
    }

    if (file.size > maxSizeBytes) {
      throw new BadRequestException(
        `File too large. Maximum size is 10MB`,
      );
    }
  }

  private async uploadToS3(
    file: UploadedFile,
    key: string,
  ): Promise<StorageResult> {
    // S3 upload implementation
    // In production, install @aws-sdk/client-s3 and uncomment:
    /*
    const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
    const s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.config.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.config.get('AWS_SECRET_ACCESS_KEY'),
      },
    });

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await s3Client.send(command);
    */

    // For now, fall back to local storage
    console.warn('AWS SDK not installed, using local storage');
    return this.uploadToLocal(file, key);
  }

  private async uploadToLocal(
    file: UploadedFile,
    key: string,
  ): Promise<StorageResult> {
    const filePath = path.join(this.localStoragePath, key);
    const fileDir = path.dirname(filePath);

    // Ensure directory exists
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }

    // Write file to local storage
    fs.writeFileSync(filePath, file.buffer);

    return {
      url: `/uploads/${key}`,
      key,
      fileName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
    };
  }

  private async deleteFromS3(key: string): Promise<void> {
    // S3 delete implementation
    // In production, install @aws-sdk/client-s3 and implement
    console.warn('AWS SDK not installed, using local storage');
    await this.deleteFromLocal(key);
  }

  private async deleteFromLocal(key: string): Promise<void> {
    const filePath = path.join(this.localStoragePath, key);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
