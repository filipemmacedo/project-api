require("dotenv").config();

let data = require("../data/data");
const axios = require("axios");
const cheerio = require("cheerio");
const bcrypt = require("bcrypt");
const db = require("../models/nedb");
const jwt = require("jsonwebtoken");

articles = [];
//  cria lista de noticias de todos os jornais utilizando o axio
//  tecnologia
data.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    $('a[href*="tecnologia"]', html).each(function () {
      const title = $(this).text();
      const url = $(this).attr("href");
      //console.log(newspaper);
      articles.push({
        title,
        url: newspaper.base + url,
        source: newspaper.name,
        img: newspaper.img,
      });
    });
  });
});

//  devolve as noticias dos jornais inserido
exports.getApi = (req, res) => {
  res.json(articles);
}


//  devolve utilizando o axio as noticias de um jornal (Id Jornal)
//  tecnologia
exports.getSpecificApi = (req, res) => {
  const newspaperId = req.params.newspaperId;
  let v_img = "";
  const newspaperAddress = data.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].address;
  const newspaperBase = data.filter(
    (newspaper) => newspaper.name == newspaperId
  )[0].base;
  for (v_index in data) {
    if (data[v_index].name == req.params.newspaperId) {
      v_img = data[v_index].img;
      break;
    }
  }
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
          img:v_img,
        });
      });
      res.json(specificArticles);
    })
    .catch((err) => console.log(err));
};

//TOKEN
exports.authenticateToken = (req, res, next) => {
  console.log("A autorizar...");
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    console.log("Token nula");
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.email = user;
    next()
  });
}
const nodemailer = require("nodemailer");
const { response } = require("express");

// async..await n??o ?? permitido no contexto global
async function enviaEmail(recipients, URLconfirm) {
  // Gera uma conta do servi??o SMTP de email do dom??nio ethereal.email
  // Somente necess??rio na fase de testes e se n??o tiver uma conta real para utilizar
  let testAccount = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'apiprojectual@gmail.com',
      pass: 'api-project-ual'
    }
  });

  // envia o email usando o objeto de transporte definido
  let info = await transporter.sendMail({
    from: 'apiprojectual', // endere??o do originador
    to: recipients, // lista de destinat??rios
    subject: "Welcome to Technology API ???", // assunto
    text: "Link to activate: " + URLconfirm, // corpo do email
    html: "<b>Link to activate: " + URLconfirm + "</b>", // corpo do email em html
  });

  console.log("Mensagem enviada: %s", info.messageId);
  // Mensagem enviada: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // A pr??-visualiza????o s?? estar?? dispon??vel se usar uma conta Ethereal para envio
  console.log(
    "URL para visualiza????o pr??via: %s",
    nodemailer.getTestMessageUrl(info)
  );
  // URL para visualiza????o pr??via: https://ethereal.email/message/WaQKMgKddxQDoou...
}

//  Devolve a p??gina de confirma????o
exports.verificaUtilizador = async (req, res) => {
  const confirmationCode = req.params.confirmationCode;
  db.crUd_ativar(confirmationCode);
  return res.redirect('/confirmation.html');
};

// REGISTAR - cria um novo utilizador
exports.registar = async (req, res) => {
  console.log("Registar novo utilizador");
  if (!req.body) {
    return res.status(400).send({
      message: "O conte??do n??o pode ser vazio!",
    });
  }
  try {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const email = req.body.email;
    const username = req.body.username;
    const password = hashPassword;
    const confirmationToken = jwt.sign(
      req.body.email,
      process.env.ACCESS_TOKEN_SECRET
    )
    const URLconfirm = `http://localhost:8000/api/auth/confirm/${confirmationToken}`
    db.Crud_registar(username, email, password, confirmationToken) // C: Create
      .then((dados) => {
        enviaEmail(email, URLconfirm).catch(console.error);
        res.status(201).send({
          message:
            "Utilizador criado com sucesso, confira sua caixa de correio para ativar!",
        });
        console.log("Controller - utilizador registado: ");
        console.log(JSON.stringify(dados)); // para debug
      });
  } catch {
    console.log(res.err);
    return res.status(400).send({ message: "Problemas ao criar utilizador" });
  }
};

// LOGIN - autentica um utilizador
exports.login = async (req, res) => {
  console.log("Autentica????o de um utilizador");
  if (!req.body) {
    return res.status(400).send({
      message: "O conte??do n??o pode ser vazio!",
    });
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  const email = req.body.email;
  const password = hashPassword;
  db.cRud_login(email) // R: Read
    .then(async (dados) => {
      if (await bcrypt.compare(req.body.password, dados.password)) {
        const user = { name: email };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        res.json({ accessToken: accessToken }); // aqui temos de enviar a token de autoriza????o
        console.log("Resposta da consulta ?? base de dados: ");
        console.log(JSON.stringify(dados)); // para debug
      } else {
        console.log("Password incorreta");
        return res.status(401).send({ erro: "A senha n??o est?? correta!" });
      }
    })
    .catch((response) => {
      console.log("controller:");
      console.log(response);
      return res.status(400).send(response);
    });
};

exports.geAllUsers = async (req, res) => {
  console.log("Lista de utilizadores");

  db.Crud_listUsers(req, res) //  R: Read lista utilizadores
    .then((dados) => {
      res.send(dados);
    })
    .catch((err) => {  //tratamento de erros
      return res
        .status(400)
        .send({ message: "N??o existem utilizadores!" });
    });
};

// devolve todas as noticias de tecnologia nos jornais criado
exports.getAllNewspapers = (req, res) => {
  console.log("Lista de Jornais");
  res.json(data);
}

// guarda as altera????es feitas ao utilizador 
exports.postUser = (req, res) => {
  console.log("Salvar altera????es do utilizador");
  const email = req.params.email;
  const username = req.body.username;
  const isAdmin = req.body.admin;
  db.Crud_saveUser(username, email, isAdmin) // U: Update
    .then((dados) => {
      res.send("Gravado com sucesso!");
    })
    .catch((err) => {  //tratamento de erros
      return res
        .status(400)
        .send({ message: "Utilizador n??o foi encontrado." });
    });
}

// guarda as altera????es de um jornal
exports.saveNewspaper = (req, res) => {
  let ok = false;

  const name = req.params.name;
  const address = req.body.address;
  const base = req.body.base;
  const img = req.body.img;

  console.log("Salvar altera????es no jornal");
  console.log(req.params.name)
  console.log(address)
  console.log(base)
  console.log(img)
  for (v_index in data) {
    if (data[v_index].name == name) {
      data[v_index].address = address;
      data[v_index].base = base;
      data[v_index].img = img;
      console.log("Gravou");
      ok = true;
      break;
    }
  }
  if (ok) {
    data.push();
    res.status(200).send("Gravado com sucesso!");
  } else {    //tratamento de erros
    return res
        .status(400)
        .send({ message: "Jornal n??o foi encontrado." });
  }
}

// cria novo jornal para listagem de noticias
exports.createNewspaper = (req, res) => {
  let ok = false;
  const name = req.body.name;
  const address = req.body.address;
  const base = req.body.base;
  const img = req.body.img;

  console.log("Criar novo jornal");
  obj = req.body;
  data.push(obj);

  console.log("Criou com sucesso!");
  ok = true;

  if (ok) {
    articles = [];
    data.forEach((newspaper) => {
      axios.get(newspaper.address).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        $('a[href*="tecnologia"]', html).each(function () {
          const title = $(this).text();
          const url = $(this).attr("href");
          //console.log(newspaper);   //  para debug
          articles.push({
            title,
            url: newspaper.base + url,
            source: newspaper.name,
            img: newspaper.img,
          });
        });
      });
    });
    res.send("Criado com sucesso!");
  } else {
    res.send("Erro ao criar o jornal.");
  }
}

// devolve a imagem logo do jornal 
exports.getImageFromNewspaper = (req,res) => {
  let ok = false;
  let img = "";

  const name = req.params.name;
  for (v_index in data) {
    if (data[v_index].name == name) {
      img=data[v_index].img;
      ok=true;
      break;
    }
  }if (ok) {
    let imgdata={
      img:img,
    }
    res.json(imgdata);
  } else {
    res.send("Erro ao devolver a imagem.");
  }
}