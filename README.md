# oauth-api

a [Sails](http://sailsjs.org) application demonstrating how to utilize OAuth and local user management

# Prerequisites
1. Install MongoDB locally
2. Node + npm 0.10+

# Instructions
1. git clone repo
2. npm install
3. Define the following environment variables:
    1. **TWITTER_APP_ID**: An app ID for Twitter which you are utilizing -- see [Twitter Apps](https://apps.twitter.com)
    2. **TWITTER_APP_SECRET**: An app secret for Twitter which you are utilizing -- see [Twitter Apps](https://apps.twitter.com)
    3. **APP_BEARER_SECRET**: A secret value of your choice, used to encode jwt's for the Bearer Strategy
4. sails lift (or node app.js)

# Twitter App Setup
* Ensure that the callback is http://127.0.0.1:1337/twitter/callback

# Usage

## Twitter

1. Browse to http://127.0.0.1:1337/auth/twitter
2. Login to your Twitter account
3. Verify that a new User object gets created with your twitterUsername and a proper access_token
4. Using the access_token given back by /twitter/callback, make any calls to the UserController

## Local - Registering

1. POST to http://127.0.0.1:1337/auth/register
    1. This endpoint expects an object with an **email** field and **password** field
2. Using the access_token returned, make any calls to the UserController

## Local - Login

1. POST to http://127.0.0.1:1337/auth/login
    1. This endpoint expects an object with an **email** field and **password** field. Use the email/password you used to register
2. Using the access_token returned, make any calls to the UserController

## User - Profile (Using Twitter)

**Note: This requires a valid access_token from any of the methods above**

1. GET to http://127.0.0.1:1337/user/profile?twitterUsername=[your twitter username]
2. Verify you get a user profile object

## User - Profile (Using Email)

**Note: This requires a valid access_token from any of the methods above**

1. GET to http://127.0.0.1:1337/user/profile?email=[your email]
2. Verify you get a user profile object

## User - Tweets From statuses/user_timeline (Using Twitter)

**Note: This requires a valid access_token from any of the methods above**

1. GET to http://127.0.0.1:1337/user/tweets?twitterUsername=[a twitter username]
2. Verify you get tweets


# Libraries Used
* [passport](https://www.npmjs.com/package/passport)
* [passport-twitter](https://www.npmjs.com/package/passport-twitter)
* [passport-http-bearer](https://www.npmjs.com/package/passport-http-bearer)
* [passport-local](https://www.npmjs.com/package/passport-local)
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
* [bcrypt](https://www.npmjs.com/package/bcrypt)
* [twit](https://www.npmjs.com/package/twit)