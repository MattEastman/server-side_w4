const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;


var favSchema = new Schema({

    dishes:[dishSchema],
    user:[UserSchema]
    
}, {
    timestamps: true
});

var favs = mongoose.model('fav', favSchema);

module.exports = favs;