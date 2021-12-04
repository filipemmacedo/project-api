const express = require('express')
const router = express.Router()
const data = require('../data/data')
const axios = require('axios')
const cheerio = require('cheerio')
const articles = require('../controller/controller')

router.get('/', (req, res) => {
    try {
        res.json(articles)
    } catch(err) {
        console.log('erro')
    }
})

router.get('/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId
    const newspaperAddress = data.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = data.filter(newspaper => newspaper.name == newspaperId)[0].base
    
    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a[href*="tecnologia"]', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

module.exports = router