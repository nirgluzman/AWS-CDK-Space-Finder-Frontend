import { type CognitoUser } from '@aws-amplify/auth';
import { Amplify, Auth } from 'aws-amplify';
import { AuthStack } from '../../../space-finder/outputs.json';

// Initialize the Amplify library and configure it to connect to AWS account and resources.
// https://docs.amplify.aws/lib/client-configuration/configuring-amplify-categories/q/platform/js/
Amplify.configure({
  Auth: {
    mandatorySignIn: false, // users are not allowed to get the aws credentials unless they are signed-in
    region: AuthStack.CognitoRegion, // Amazon Cognito region
    userPoolId: AuthStack.SpaceUserPoolId, // Amazon Cognito User Pool ID
    userPoolWebClientId: AuthStack.SpaceUserPoolClientId, // Amazon Cognito App Client ID
    identityPoolId: AuthStack.SpaceIdentityPoolId, // Amazon Cognito Identity Pool ID
    authenticationFlowType: 'USER_PASSWORD_AUTH', // authentication flow type -  users to provide their username and password to the application
  },
});

export class AuthService {
  private user: CognitoUser | undefined;

  // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#auto-sign-in-after-sign-up
  public async login(userName: string, password: string): Promise<Object | undefined> {
    try {
      this.user = (await Auth.signIn(userName, password)) as CognitoUser;
      return this.user;
    } catch (error) {
      console.error('error signing in', error);
      return undefined;
    }
  }

  public getUserName() {
    return this.user?.getUsername(); // CognitoUser class method
  }
}
