const Datastore = require("nedb");
let db = {};
db.users = new Datastore("users.db");
db.users.loadDatabase();

// Ativa um utilizador (faz um Update)
exports.crUd_ativar = (confirmationToken) => {
  db.users.update(
    {
      confirmationToken: confirmationToken,
    },
    {
      $set: {
        confirm: 1,
      },
    },
    {},
    function (err, nRegistos) {
      console.log("Registos alterados---->" + nRegistos);
    }
  );
};

// Retorna o utilizador e sua password encriptada
exports.cRud_login = (email) => {
  return new Promise((resolve, reject) => {
    // busca os registos que contêm a chave
    db.users.findOne(
      {
        _id: email,
      },
      (err, user) => {
        if (err) {
          reject({ msg: "Problemas na base de dados!" });
        } else {
          if (user == null) {
            reject({ msg: "Utilizador inexistente!" });
          } else if (user.confirm != 1) {
            reject({ msg: "Ativação pendente. Verifique seu email!" });
          } else {
            resolve(user);
          }
        }
      }
    );
  });
};

exports.Crud_registar = (email, password, confirmationToken) => {
  // insere um novo utilizador
  return new Promise((resolve, reject) => {
    data = {
      _id: email,
      confirm: 0,
      password: password,
      confirmationToken: confirmationToken,
    };
    db.users.insert(data, (err, dados) => {
      if (err) {
        reject(null);
      } else {
        resolve(dados);
      }
    });
  });
};