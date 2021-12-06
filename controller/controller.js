const data = require("../data/data");
const axios = require("axios");
const cheerio = require("cheerio");
const bcrypt = require("bcrypt");

articles = [];

data.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    $('a[href*="tecnologia"]', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");

      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name,
      });
    });
  });
});

exports.getApi = (req, res) => {
  try {
    res.json(articles);
  } catch (err) {
    console.log("erro");
  }
};

exports.getSpecificApi = (req, res) => {
  const newspaperId = req.params.newspaperId;
  const newspaperAddress = data.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].address;
  const newspaperBase = data.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].base;

  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];

      $('a[href*="tecnologia"]', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId,
        });
      });
      res.json(specificArticles);
    })
    .catch((err) => console.log(err));
};

users = [];

exports.usersGet = (req, res) => {
  res.json(users);
};
exports.usersPost = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { name: req.body.name, password: hashedPassword };
    users.push(user);
    res.status(201).send();
  } catch {
    res.status(500).send();
  }
};
exports.usersLogged = async (req, res) => {
  const user = users.find((user) => (user.name = req.body.name));
  if (user == null) {
    return res.status(400).send("Cannot find user");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send("Success");
    } else {
      res.send("Not allowed");
    }
  } catch {
    res.status(500).send();
  }
};
