import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { AuthService } from './AuthService';
import { AuthStack, DataStack, ApiStack } from '../../../space-finder/outputs.json';
import { SpaceEntry } from '../components/model/model';

const spaceFinderUrl = ApiStack.ApiEndpoint + 'spaces';

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
        region: AuthStack.awsRegion,
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
    const putObjectCommand = new PutObjectCommand({
      Bucket: DataStack.SpaceFinderPhotosBucketName,
      ContentType: file.type,
      Key: encodedFileName,
      ACL: 'public-read',
      Body: file,
    });

    const response = await this.s3Client.send(putObjectCommand);

    // public url of the file uploaded to S3
    // https://stackoverflow.com/questions/73530333/how-to-get-public-url-of-file-uploaded-to-s3-using-aws-sdk-version-3
    const filePublicUrl = `https://${DataStack.SpaceFinderPhotosBucketName}.s3.${AuthStack.awsRegion}.amazonaws.com/${encodedFileName}`;

    return filePublicUrl;
  }

  public reserveSpace(spaceId: string) {
    return spaceId.slice(0, 4);
  }

  public async getSpaces(): Promise<SpaceEntry[]> {
    const getSpaceResult = await fetch(spaceFinderUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authService.jwtIdToken!,
      },
    });

    const getSpaceResultJSON = await getSpaceResult.json();

    return getSpaceResultJSON;
  }

  public async createSpace(name: string, location: string, photo?: File) {
    const space = {} as any;
    space.name = name;
    space.location = location;

    if (photo) {
      const photoPublicUrl = await this.uploadFile(photo);
      space.photoUrl = photoPublicUrl;
    }

    const postResult = await fetch(spaceFinderUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.authService.jwtIdToken!,
      },
      body: JSON.stringify(space),
    });

    const postResultJSON = await postResult.json();

    return postResultJSON.message;
  }

  public isLogin() {
    return this.authService.isLogin();
  }
}
