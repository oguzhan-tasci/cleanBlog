const express = require("express");
const path = require("path");
const ejs = require("ejs");
const exp = require("constants");
const mongoose = require('mongoose');
const Photo = require('./models/Photo');
const app = express();
const fs = require('fs');
const fileUpload = require('express-fileupload');
const connectDB = require('./db/connection');
// Tarayıcıya 'put' request gönderemediğimiz için 'post' request gibi davranmasını sağlayacağız. 
//  Bu yüzden de 'method-override' paketini indirdik (npm i method-override) 
const methodOverride = require('method-override');
require('dotenv').config();


const port = 3000;
connectDB(process.env.MONGO_URl).then(result => {
    app.listen(port, () => {
        console.log(`Server is running on ${port}`);
    })
}).catch(error => {
    console.log(error);
})

// Template Engine
//ejs, bizim klasör yapısındaki 'views' klasörünün içine bakar.
app.set("view engine", "ejs"); // ejs'nin kullanacağımız 'Template Engine' olduğunu belirtiyoruz.

// Middleware : Projemizde bazı static dosyalar olur bunlar :görseller, html vs. projenin 'makyaj'ı oldugu tarafı olur.
// Bu verileri dinamik olarak değiştirmek,sıralamak vs. işlemleri yapmak isteriz.

// const myLogger = (req,res,next) => {
//     console.log("Middleware Log 1");
//     next(); // eğer next'i yazmazsak bir döngüye giriyor.
//     // Request - Middleware - Respond arasındakş köprüyü oluştururken sıradaki miiddleware kısmına geçmesi için kullanıyoruz.
// }

// const myLogger2 = (req,res,next) => {
//     console.log("Middleware 2");
//     next();
// }

// app.use(myLogger);
// app.use(myLogger2);

// Bu bir 'middleware' kodudur. Sürekli 'request-respond' işlemi yapıyoruz. Bu işlemi döngüye almamıza. özelleştirmemizi sağlayan middleware'dir.
app.use(express.static("public")); // Bu kodu yazarak 'static' dosyamızı 'public' dosyasına yönlendiriyoruz.
app.use(fileUpload());
app.use(express.urlencoded({
    extended: true
})); // json ve urlencoded'ı 'undefined' hatası vermemesi için kullanıyoruz. 
// Kullanılmadığı takdirde 'req.body' , 'undefined' döner.
app.use(express.json());
app.use(methodOverride('_method', {
    methods: ['POST', 'PUT']
}));

// req.body -> Formlarda girdiğimiz değerleri , post ettiğimiz değerleri döndürür.

// ROUTES
app.get('/', async (req, res) => {
    // res.sendFile(path.resolve(__dirname,'temp/index.html')); -> ejs'siz böyle kullanılıyor ; ejs'li ise alttaki gibi.
    const photos = await Photo.find({}).sort('-dateCreated'); // sort sayesinde yüklenme tarihine göre sıralıyoruz (- ile )
    res.render('index', {
        photos
    });
})
app.get('/photos/:id', async (req, res) => {
    const photo = await Photo.findById(req.params.id);
    res.render('photo', { // ilki göderilecek template'i , ikincisi ise yukarıda oluşturulan id'i tutan değişken
        photo
    })
})

app.get('/about', (req, res) => {
    res.render('about');
})

app.get('/add', (req, res) => {
    res.render('add');
})


app.post('/photos', async (req, res) => { // form'un içinde 'action'a verdiğim isim ile aynı işmi kullandık : "/photos"
    // console.log(req.files.image); -> Yükledigimiz resmin bilgilerine 'req.files.image' şeklinde ulaşabiliyoruz.

    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) { // public'in içinde 'uploads' diye bir dosya var mı ? Yoksa :
        fs.mkdirSync(uploadDir); // Eğer böyle bir dosya yoksa oluştur
    }
    let uploadeImage = req.files.image; // yüklenen resim
    let uploadPath = __dirname + '/public/uploads' + uploadeImage.name // görsellerin nerede depolanacağını belirtiriz 

    uploadeImage.mv(uploadPath, async () => {
        await Photo.create({
            ...req.body,
            image: '/uploads/' + uploadeImage.name,
        })
        res.redirect('/')

    })
})

app.get('/photos/edit/:id', async (req, res) => {
    // const photoID = req.params; 
    const photo = await Photo.findOne({
        _id: req.params.id
    });
    res.render('edit', {
        photo
    })
})

app.put('/photos/:id', async (req, res) => {
    const photo = await Photo.findOne({
        _id: req.params.id
    });
    // const {title,description} = req.body;
    photo.title = req.body.title;
    photo.description = req.body.description;
    photo.save()

    res.redirect(`/photos/${req.params.id}`);

})
app.delete('/photos/:id', async (req, res) => {
    const photo = await Photo.findOne({
        _id: req.params.id
    });
    let deletedImage = __dirname + '/public' + photo.image; // photo.image veritabanından gelir : /uploads/code_unsplash.jpg (example)
    fs.unlinkSync(deletedImage);
    await Photo.findByIdAndRemove(req.params.id);
    res.redirect('/');
})

app.get('*', (req, res) => {
    res.send("404 ERROR");
})