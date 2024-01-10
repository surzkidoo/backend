const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

// Create Schema
const TransactionSchema = new Schema({

    meter_name: { type: String},
    meter_number: { type: String },
    reference: { type: String },
    token: { type: String },
    units: { type: String },
    email: { type: String },
    apiKey: { type: String},
    firstName: { type: String},
    address: { type: String},
    phoneNumber: { type: String},
    recharge_id: { type: String},
    product_code: { type: String},
    servicecharge: { type: String},
    amount: { type: String},
    amount_charged: { type: String},
    date: { type: Date, default: Date.now},
    transactionType: { type: String},
    interest: { type: String},
    id:{ type: String},
    paymentmode:{ type: String},
    vendorCode: {type: String},
    status: {type: String},
    order_no: {type: String},
    userId : {type: String},
    description:{type: String},
    paymentdata:{type: Array},
    TxRef:{type:String},
    afterBalance:{type:String},
    recipient_code:{type:String},
    accountname:{type:String},
    bankname:{type:String},
    accountNumber: {type:String},
    banktype:{type:String},
    beforeBalance:{type:String},
    date: {
        type: Date, 
        default: Date.now()
    }

})

TransactionSchema.plugin(mongoosePaginate);

// Create Model
const Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;

