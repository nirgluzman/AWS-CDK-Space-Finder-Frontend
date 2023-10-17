Course GitHub repo:
git@github.com:alexhddev/CDK-course-resources.git

GitHub repo:
git@github.com:nirgluzman/AWS-CDK-Space-Finder-Frontend.git


Steps:
- create web app (React)
- create deployment bucket
- create a BucketDeployment construct
- create an originIdentity construct that can read that bucket
- create a CloudFrontDistribution


Build React app with Vite, https://vitejs.dev/guide/
npm create vite@latest -- --template react-ts


Amplify library for user authentication:
aws-amplify
@aws-amplify/auth


AWS SDK library for interaction with Amazon Cognito Federated Identities:
@aws-sdk/client-cognito-identity


AWS SDK library for S3 operations:
@aws-sdk/client-s3
