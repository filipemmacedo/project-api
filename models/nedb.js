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

exports.Crud_registar = (username, email, password, confirmationToken) => {
  return new Promise((resolve, reject) => {
    data = {
      username: username,
      _id: email,
      confirm: 0,
      password: password,
      confirmationToken: confirmationToken,
      admin: 0,
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

exports.Crud_listUsers = (req, res) => {
  return new Promise((resolve, reject) => {
    // lê todos os registos
    db.users.find({}, (err, dados) => {
      if (err) {
        reject("Não existem utilizadores!");
      } else {
        resolve(dados);
      }
    });
  });
};

exports.Crud_listNewspapers = (req, res) => {
  return new Promise((resolve, reject) => {
    // lê todos os registos
    db.users.find({}, (err, dados) => {
      if (err) {
        reject("Não existem utilizadores!");
      } else {
        resolve(dados);
      }
    });
  });
};

exports.Crud_saveUser = (username, email, isAdmin) => {
  return new Promise((resolve, reject) => {
    db.users.update({ _id: email }, { $set: { username: username, admin: isAdmin } }, {},  (err,dados) => {
      if (err) {
        console.log(err);
      //  reject("Utilizador não existe!");
      } else {
        console.log(dados);
        resolve(dados);
      }
    });
  });
};