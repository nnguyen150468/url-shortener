var express = require('express');
var router = express.Router();
const shortID = require('shortid')
const { loadData, saveData } = require('../utils/data')

/* GET home page. */
router.get('/', function(req, res, next) {
  const data = loadData()
  res.render('index', { title: 'URL Shrinker', URLs: data });
});

router.post('/shortURL', async (req, res) => {
  const data = loadData();
  
  //check for duplicates
  if(data.some(item => item.full === req.body.fullURL)){
    return res.render('index', { title: 'URL Shrinker',error: "We already have a shortened URL for that link", URLs: data})
  }

  //generate short link
  const url = {
    full: req.body.fullURL,
    short: await shortID.generate(),
    clicks: 0
  }
  
  data.unshift(url)
  saveData(data)
  console.log('data',data)
  res.render('index', { title:"URL Shrinker", URLs: data })
})

router.get('/shortURL', (req, res) => {
  const data = loadData()
  res.render('index', { title: 'URL Shrinker', URLs: data });
})

router.get('/:shortURL', (req, res) => {
  const data = loadData()
  let fullURL = data.find(item => item.short === req.params.shortURL)
  //increase clicks and update data
  fullURL.clicks++
  data.map(item => {
    if(item.full === fullURL.full){
      item = fullURL
    }
  })
  saveData(data)
  //go to original link
  res.redirect(fullURL.full)
})

module.exports = router;
