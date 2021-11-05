const express = require('express')
const app = express()
const port = 3003

const axios = require('axios')
const puppeteer = require('puppeteer');
const getUrls = require('get-urls');


app.use(express.static('public'))


app.get('/api', function (req, res) {
  console.log(req.query)
  console.log(req.params)
  const url = getUrls(req.query.url).values().next().value;
  //console.log(url)
  if (url) {
    console.log(url)
    console.log('iam url')
    // Launching the Puppeteer controlled headless browser and navigate to the Digimon website
    puppeteer.launch().then(async function (browser) {
      const page = await browser.newPage();
      const response = await page.goto(url ,{ waitUntil : "networkidle0"});
      page.once('load', () => console.log('Page loaded!'));
      await page.screenshot({ path: 'public/example.png', fullPage: true});
      const resp =  await response.text();
      await browser.close();
      res.set('Content-Type', 'text/html');
      res.write("<img src='/example.png'>");
      res.write("<p>"+resp+"</p>");
      // Sending the Digimon names to Postman
      res.send();
    });
  }else{
    res.sendStatus(404)
  }
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})