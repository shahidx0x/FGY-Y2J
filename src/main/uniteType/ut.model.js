const mongoose = require('mongoose');

const unitTypeSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
});

const UnitType = mongoose.model('UnitType', unitTypeSchema);

module.exports = UnitType;
