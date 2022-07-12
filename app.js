const express = require("express");
const path = require("path");

const app = express();

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

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname,'temp/index.html'));
})




const port = 3000;
app.listen(port, () => {
    console.log(`Sunucu ${port} icerisinde calismaya basladi...`);
})