const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// connect DB
mongoose.connect('mongodb://localhost/pcat-test-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Create Schema
const PhotoSchema = new Schema({
    title: String,
    description: String
})

const Photo = mongoose.model('Photo', PhotoSchema); // İlk mongo db'de olusacak collection'un ismi,ikincisi Schema'nın ismi


// Create a photo
// Photo.create({
//     title: "Photo Title 2",
//     description: "Photo 2 description lorem ipsum"
// });


// read a photo
// Photo.find({},(err,data)=> {
//     console.log(data);
// })

// Update a photo
// const id = "62d1b5f3e44bba5fafbe9af7";

// Photo.findByIdAndUpdate(
//     id, {
//         title: "Photo Title 1 Updated 111",
//         description: "Photo Title 1 description updated 111"
//     }, {
//         new: true // güncellenen veri hemen gözükmesini istiyorsak 'true' olarak işaretlemeliyiz!
//     },
//     (err, data) => {
//         console.log(data);
//     }
// )

// Delete a photo
// const id = "62d1b5f3e44bba5fafbe9af7";

// Photo.findByIdAndDelete(id, (err, data) => {
//     console.log("Photo is removed!");
// })