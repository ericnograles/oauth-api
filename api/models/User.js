/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  tableName: 'User',
  attributes: {
    firstName: 'STRING',
    lastName: 'STRING',
    email:{
      type: 'STRING',
      unique: true
    },
    password: 'STRING',
    twitterUsername: 'STRING', // Accommodation for Twitter. They do not provide email address.
    oAuthTokens: 'JSON', // Stores oAuthTokens for social networks
    access_token: 'STRING',

    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      delete obj.oAuthTokens;
      return obj;
    }
  }
};

