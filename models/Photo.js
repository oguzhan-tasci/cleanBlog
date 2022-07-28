const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
    title: String,
    description: String,
    image: String,
    dateCreated: {
        type: Date,
        default: Date.now
    }
})

const Photo = mongoose.model('Photo', PhotoSchema); // İlk mongo db'de olusacak collection'un ismi,ikincisi Schema'nın ismi


module.exports = Photo;