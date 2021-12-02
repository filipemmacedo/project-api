const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { contains } = require('cheerio/lib/static')

const app = express()

app.get('/', (req, res) => {
    res.json('Bem vindos à minha API')
})

app.get('/news', (req, res) => {
    axios.get('https://www.jornaldenegocios.pt/mercados')
        .then((response) => {
            const html = response.data
            const $ = cheerio.load(html)
            const articles = []

        $('a:contains("bolsas")', html).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            articles.push({
                title,
                url,
            })
            }) 
            res.json(articles)
        })
})

app.listen(PORT, () => console.log(`Working on Port ${PORT}`))