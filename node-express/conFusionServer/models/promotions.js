const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var promotionsSchema = new Schema({
   price: {
        type: Currency,
        required: true,
        min: 0
    },
    name:  {
        type: String,
        required: true
    },
     image: {
        type: String,
        required: true
    },
     label: {
        type: Boolean,
        default:false    
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});


var Promotions = mongoose.model('promotion', promotionsSchema);

module.exports = Promotions;