const data = require('../data/data')
const axios = require('axios')
const cheerio = require('cheerio')

const articles = []

data.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            
            $('a[href*="tecnologia"]', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
})

module.exports = articles