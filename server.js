const express = require('express')
const app = express()
app.use(express.urlencoded({extended: true})) 

const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb+srv://admin:admin123@cluster0.y6p2d0u.mongodb.net/?retryWrites=true&w=majority', function(err, client) {
    if (err) return console.log(err);
    //서버띄우는 코드 여기로 옮기기
    app.listen('8080', function(){
      console.log('listening on 8080')
    });
})

app.get('/pet', function(req, res) {
    res.send('펫용품 판매 페이지입니다.')
})

app.get('/beauty', function(req, res) {
    res.send("뷰티용품 판매 페이지입니다.")
})

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
})

app.get('/write', function(req, res) {
    res.sendFile(__dirname + '/write.html')
})

app.post('/add', function(req, res) {
    console.log(req.body)
    res.send("전송완료")
})