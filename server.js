const express = require('express')
const app = express()
app.use(express.urlencoded({extended: true})) 
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs')
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

app.use('/public', express.static('public'))

var db
MongoClient.connect('mongodb+srv://admin:admin123@cluster0.y6p2d0u.mongodb.net/?retryWrites=true&w=majority', function(err, client) {
    if (err) return console.log(err)
    db = client.db('todoapp')

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
    res.render('index')
})

app.get('/write', function(req, res) {
    res.render('write')
})

app.post('/add', function(req, res) {

    db.collection('counter').findOne({ name : '게시물갯수' }, function(_, result) {
        var totalPostCount = result.totalPost
        db.collection('post').insertOne( { _id : (totalPostCount + 1), 제목 : req.body.title, 날짜 : req.body.date} , function(_, _) {
            db.collection('counter').updateOne({ name:'게시물갯수' }, { $inc: {totalPost:1} }, function(err, _) {
                if(err) {
                    console.log(err)
                }
                res.send('전송완료')
            })
        });
    })

})

app.get('/list', function(req, res) {
    db.collection('post').find().toArray(function(err, result) {
        console.log(result)
        res.render('list.ejs', { posts : result })
    })
})

app.delete('/delete', function(req, res) {
    console.log(req.body)

    req.body._id = parseInt(req.body._id)
    db.collection('post').deleteOne(req.body, function(err, result) {
        console.log('삭제완료')
        res.status(200)
    })
})

app.get('/detail/:id', (req, res) => {
    db.collection('post').findOne({_id : parseInt(req.params.id)}, (err, result) => {
        res.render('detail.ejs', {data : result})
    })
})

app.get('/edit/:id', (req, res) => {
    db.collection('post').findOne({_id : parseInt(req.params.id)}, (err, result) => {
        res.render('edit.ejs', { post : result})
    })
})

app.put('/edit/:id', (req, res) => {
    console.log(req)
})