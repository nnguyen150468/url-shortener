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
  let data = loadData();
  
  //check for duplicates. If duplicate, unshift it to the top
  const urlIndex = data.findIndex(item => item.full === req.body.fullURL)
  console.log('urlIndex',urlIndex)
  if(urlIndex!==-1){
    let sameURL = data.splice(urlIndex,1)
    console.log('sameURL', sameURL)
    data = await sameURL.concat(data)
    console.log('new data',data)
    saveData(data)
    return res.render('index', { title:"URL Shrinker", URLs: data })
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

router.get('/:shortURL', async (req, res) => {
  const data = loadData()
  let fullURL = data.find(item => item.short === req.params.shortURL)
  //increase clicks and update data
  fullURL.clicks++
  await data.map(item => {
    if(item.full === fullURL.full){
      item = fullURL
    }
  })
  saveData(data)
  //go to original link
  res.redirect(fullURL.full)
})

module.exports = router;
