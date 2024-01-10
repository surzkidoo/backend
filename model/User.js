const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const mongoosePaginate = require('mongoose-paginate-v2');


// Create Schema
const UserSchema = new Schema({
    fullname: { type: String},
    firstName: { type: String},
    lastName: { type: String },
    email: { type: String },
    password: { type: String },
    userType: { type: String, default: 'user' },
    status: { type: String, default: 'active' },
    apiKey: { type: String},
    address: { type: String},
    city: { type: String},
    state: { type: String},
    zip: { type: String},
    phoneNumber: { type: String},
    dateOfBirth: { type: String},
    createdAt: { type: Date, default: Date.now },
    balance: { type: Number, default: 0 },
    borrowedAmount: {type: Number, default: 0},
    authCode: {type: String, default:""},
    returningUser: { type: String},
    claims: {type: Number, default: 0},
    otp : {type: Number, default: 0},
    role : {type: String},
    pin : {type: String},
    referalCode: {type:String},
    accountDetails: {type: Array},
    limit: {type: String},
    timelimit :{ type: Date, default: Date.now } 
})

UserSchema.plugin(mongoosePaginate);


// Create Model
const User = mongoose.model('User', UserSchema);
module.exports = User;

