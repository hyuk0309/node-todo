const express = require('express')
const app = express()
app.use(express.urlencoded({extended: true})) 
const MongoClient = require('mongodb').MongoClient;
app.use('/public', express.static('public'))
const methodOverride = require('method-override')
app.use(methodOverride('_method'))

const password = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session');
const passport = require('passport');

app.use(session({secret : '비밀코드', resave : true, saveUninitialized : false}))
app.use(passport.initialize())
app.use(passport.session())

app.set('view engine', 'ejs')

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

app.put('/edit', (req, res) => {
    db.collection('post').updateOne(
        { _id : parseInt(req.body.id) },
        { $set : { 제목 : req.body.title, 날짜 : req.body.date }},
        (err, result) => {
            console.log('수정완료')
            res.redirect('/list')
        })
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.post('/login', passport.authenticate('local', {failureRedirect : '/fail'}), (req, res) => {
    res.redirect('/')
})

passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    session: true,
    passReqToCallback: false
}, function (inputId, inputPw, done) {
    db.collection('login').findOne({ id: inputId}, function(err, result) {
        if (err) return done(err)

        if (!result) return done(null, false, { message : '존재하지않는 아이디요' })
        if (inputPw == result.pw) {
            return done(null, result)
        } else {
            return done(null, false, { message : '비번틀렸어요' })
        }
    })
}))

// session 만들고 session_id 쿠키로 반환
passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    db.collection('login').findOne({ id: id}, (err, result) => {
        done(null, result)
    })
})

app.get('/mypage', hasAuthenticated, (req, res) => {
    res.render('mypage.ejs', { user : req.user })
})

function hasAuthenticated(req, res, next) {
    if (req.user) {
        next()
    } else {
        res.redirect('/login')
    }
}