# Building Trade Records Locally

cd into directory of choice

```
git clone https://github.com/AlexKraham/trade_records.git
```

### 1. Build dependencies

If you don not have npm installed yet, install it.
Then run `npm install`

### 2. Starting the Front End locally

To start the React front end locally, use the following command in the root directory

```
npm run start
```

### 3. Deploying changes (to the front end)

To deploy changes to the front end to live production

```
npm run client-deploy
```

This will deploy the website to the CloudFront and update the S3 bucket. This, however, requires an authorized AWS profile. You can change the profile in the package.json under 'scripts' in two places: client-s3-deploy && client-cloudfront-invalidation.

### 4. Deploying changes to Claudia and the API Gateway

```
cd claudia-api
npm install
```

If you have not already, install aws-sdk and use the command aws-configure to set up a AWS IAM role that has access to update the API Gateway.

To deploy changes

```
claudia update
```
