import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { AuthService } from './AuthService';
import { AuthStack, DataStack } from '../../../space-finder/outputs.json';

export class DataService {
  private authService: AuthService;
  private s3Client: S3Client | undefined;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  public async uploadFile(file: File) {
    const credentials = (await this.authService.getTemporaryCredentials()) as any;

    if (!credentials) {
      throw new Error('No temporary credentials');
    }

    if (!this.s3Client) {
      // initiate client with configuration.
      this.s3Client = new S3Client({
        region: AuthStack.CognitoRegion,
        credentials: {
          accessKeyId: credentials.AccessKeyId,
          secretAccessKey: credentials.SecretKey,
          sessionToken: credentials.SessionToken,
        },
      });
    }

    // encoding the file name in case it contains special characters.
    // https://stackoverflow.com/questions/62818659/s3-is-encoding-urls-with-spaces-and-symbols-to-unkown-format
    const encodedFileName = encodeURIComponent(file.name);

    // upload an object to a bucket.
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/classes/putobjectcommand.html
    const putCommand = new PutObjectCommand({
      Bucket: DataStack.SpaceFinderPhotosBucketName,
      ContentType: file.type,
      Key: encodedFileName,
      ACL: 'public-read',
      Body: file,
    });

    const response = await this.s3Client.send(putCommand);

    // public url of the file uploaded to S3
    // https://stackoverflow.com/questions/73530333/how-to-get-public-url-of-file-uploaded-to-s3-using-aws-sdk-version-3
    const filePublicUrl = `https://${DataStack.SpaceFinderPhotosBucketName}.s3.${AuthStack.CognitoRegion}.amazonaws.com/${encodedFileName}`;

    return filePublicUrl;
  }

  public async createSpace(name: string, location: string, photo?: File) {
    if (photo) {
      const photoPublicUrl = await this.uploadFile(photo);
      console.log(photoPublicUrl);
    }

    return 123;
  }

  public isAuthorized() {
    return true;
  }
}
