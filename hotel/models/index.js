const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a Schema and a Model

const IndexSchema = new Schema({
    room_id: {
        type: Number,
        required: true
    }
        /**room_type_id: Number,
        room_price_id: Number,
        room_image_name: String,
        room_floor: Number,
        room_add_info: String*/

});


 module.exports = mongoose.model('Index', IndexSchema);
