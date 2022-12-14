const express = require('express')
const app = express()

app.listen(8080, function() {
    console.log('start server... port : 8080')
})

app.get('/pet', function(req, res) {
    res.send('펫용품 판매 페이지입니다.')
})

app.get('/beauty', function(req, res) {
    res.send("뷰티용품 판매 페이지입니다.")
})