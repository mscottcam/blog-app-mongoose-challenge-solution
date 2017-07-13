const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//--------blogPostSchema--------------
const blogPostSchema = mongoose.Schema({
  author: {
    firstName: String,
    lastName: String
  },
  title: {type: String, required: true},
  content: {type: String},
  created: {type: Date, default: Date.now}
});

blogPostSchema.virtual('authorName').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    author: this.authorName,
    content: this.content,
    title: this.title,
    created: this.created
  };
}


//--------userSchema------------
const userSchema = mongoose.Schema({
  "username": {
    type: String, required: true, unique: true
  },
  "password": {type: String, required: true},
  "firstName": {type: String},
  "lastName": {type: String}
});

userSchema.methods.validatePassword = function(password) {
  return bcrypt
    .compare(password, this.password)
    .then(isValid => isValid);
}

userSchema.statics.hashPassword = function(password) {
  return bcrypt
    .hash(password, 10)
    .then(hash => hash);
}

userSchema.methods.apiRepr = function() {
  return {
    userName: this.username,
    firstName: this.firstName,
    lastName: this.lastName
  }
}

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
const User = mongoose.model('User', userSchema);
module.exports = {BlogPost};
