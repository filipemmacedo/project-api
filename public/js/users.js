//const urlBase = "http://localhost:8000/api";
const modalLogin = document.getElementById("modalLogin");
const bsModalLogin = new bootstrap.Modal(
  modalLogin,
  (backdrop = "static")
); // Pode passar opções
const modalRegistar = document.getElementById("modalRegistar");
const bsModalRegistar = new bootstrap.Modal(
  modalRegistar,
  (backdrop = "static")
); // Pode passar opções

const btnModalLogin = document.getElementById("btnModalLogin");
const btnModalRegistar = document.getElementById("btnModalRegistar");
const isLogin = document.getElementById("isLogin");
const btnNewspapper = document.getElementById("btnNewspapper");

modalLogin.addEventListener("shown.bs.modal", () => {
  document.getElementById("usernameLogin").focus();
});
btnModalLogin.addEventListener("click", () => {
  bsModalLogin.show();
});
btnModalRegistar.addEventListener("click", () => {
  bsModalRegistar.show();
});
function logOff() {
  localStorage.removeItem("token");
  document.getElementById("isLogin").style.display = "none";
  document.getElementById("nespaperslist").style.display = "none";
  window.location.replace("index.html");
}

async function getUsers() {
  let url = urlBase + "/users";
  const myInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Bearer " + localStorage.getItem('token'),
    },
  };
  const myRequest = new Request(url, myInit);

  await fetch(myRequest).then(async function (response) {
    if (!response.ok) {
      listaUsers.innerHTML = "Não posso mostrar as utilizadores de momento!";
    } else {
      listUsers = await response.json();
      let tabela = `<table class="table">
                    <thead class="thead-dark">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Utilizador</th>
                        <th scope="col">Email</th>
                        <th scope="col">isAdmin</th>
                      </tr>
                    </thead>
                    <tbody>`;
      for (const user of listUsers) {
        if (user.confirm == 1) {
          tabela += `<tr>
                  <th scope="row"><a href="javascript:editUser('${user.username}','${user._id}','${user.admin}');"><i class="fas fa-user-edit"></i></a></th>
                  <td>${user.username}</td>
                  <td>${user._id}</td>`;
          if (user.admin == 1) {
            tabela += `<td><font color="green"><i class="fas fa-check-circle" color="green"></i></font></td>
                    </tr>`;
          } else {
            tabela += `<td><font color="red"><i class="fas fa-times-circle" ></i></font></td>
                    </tr>`;
          }
        }
      }
      tabela += `</tbody>
             </table>`;

      swal.fire(
        {
          title: "Lista de Utilizadores",

          showCancelButton: false,
          confirmButtonText: "Fechar",
          cancelButtonText: "Fechar",
          html: tabela,
        });
    }
  });

}
//Editar utilizador
function editUser(v_user, v_id, v_isAdmin) {
  let isChek = "";
  if (v_isAdmin == 1) {
    isChek = "checked";
  }
  swal.fire(
    {
      title: "Utilizador",

      showCancelButton: true,
      confirmButtonText: "Gravar",
      confirmButtonColor: "#218838",
      cancelButtonText: "Fechar",
      html: ' <form id="movieForm">' +
        '<div class="form-group">' +
        '<i class="fas fa-user-edit fa-5x"></i>' +
        '</div><br><br>' +
        '<div class="form-group">Email' +
        ' <div name="email" id="email" class="form-control">' +
        v_id +
        '</div>' +
        "</div><br>" +
        '<div class="form-group">' +
        'User<input type="text" name="user" id="user" class="form-control input-sm" placeholder="User" value="' +
        v_user +
        '">' +
        "</div><br>" +
        '<div class="form-switch"> ' +
        '<input class="form-check-input" type="checkbox" name="isAdmin" id="isAdmin" value="' +
        1 +
        '" ' + isChek + '>' +
        '<label class="form-check-label" for="isAdmin">&nbsp;Is Administrator</label>' +
        "</div><br>" +
        "</form>",
      preConfirm: () => {
        let error_msg = "";

        if (!document.getElementById("user").value) {
          error_msg += "User is required.<br>";
        }
        if (error_msg) {
          Swal.showValidationMessage(error_msg);
        }
      },
    }).then((result) => {
      if (!result.isConfirmed) {
        getUsers();
      } else {
        const user = document.getElementById("user").value;
        let isAdmin = 0;
        if (document.getElementById("isAdmin").checked == true) {
          isAdmin = 1;
        }
        fetch(`${urlBase}/users/${v_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Bearer " + localStorage.getItem('token'),
          },
          body: `username=${user}&admin=${isAdmin}`,
        })
          .then(async (response) => {
            if (!response.ok) {
              erro = response.statusText;
              statReg.innerHTML = response.statusText;
              throw new Error(erro);
            }
            Swal.fire({
              icon: "success",
              title: v_user,
              text: "Gravado com sucesso!",
              showConfirmButton: false,
              timer: 1500,
            }).then((result) => {
              getUsers();
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Erro ao alterar o utilizador!",
              showConfirmButton: false,
            });
            getUsers();
          });

      }
    });
}


function validaRegisto() {
  let username = document.getElementById("username").value;
  let email = document.getElementById("usernameRegistar").value; // email é validado pelo próprio browser
  let senha = document.getElementById("senhaRegistar").value; // tem de ter uma senha
  const statReg = document.getElementById("statusRegistar");
  let errMsg = "";
  if (username == "") {
    errMsg += "Name is riquired!<br>";
  }
  if (email == "") {
    errMsg += "Email is riquired!<br>";
  }
  if (senha.length < 4) {
    errMsg += "Password must have at least 4 characters!<br>";
  }
  if (errMsg != "") {
    Swal.fire({
      icon: "error",
      title: errMsg,
      showConfirmButton: false,
      timer: 1500,
    });
    return;
  }
  fetch(`${urlBase}/registar`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    body: `username=${username}&email=${email}&password=${senha}`,
  })
    .then(async (response) => {
      if (!response.ok) {
        erro = response.statusText;
        statReg.innerHTML = response.statusText;
        throw new Error(erro);
      }
      result = await response.json();
      console.log(result.message);
      document.getElementById("btnRegisterClose").click();
      Swal.fire({
        icon: "success",
        text: result.message,
        showConfirmButton: true,
      }).then((result) => {
        document.location.reload(true);
      });
      statReg.innerHTML = result.message;
    })
    .catch((error) => {
      document.getElementById(
        "statusRegistar"
      ).innerHTML = `Pedido falhado: ${error}`;
    });
}

function validaLogin() {
  let email = document.getElementById("usernameLogin").value; // email é validado pelo próprio browser
  let senha = document.getElementById("senhaLogin").value; // tem de ter uma senha
  let errMsg = "";
  if (email == "") {
    errMsg += "Email is riquired!<br>"
  }
  if (senha.length < 4) {
    errMsg += "Password must have at least 4 characters!<br>";
  }
  if (errMsg != "") {
    Swal.fire({
      icon: "error",
      title: errMsg,
      showConfirmButton: false,
      timer: 1500,
    });

    return;
  }
  const statLogin = document.getElementById("statusLogin");

  fetch(`${urlBase}/login`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST", // o login não vai criar nada, só ver se o user existe e a pass está correta
    body: `email=${email}&password=${senha}`,
  })
    .then(async (response) => {
      if (!response.ok) {
        erro = await (response.json())
        throw new Error(erro.msg);
      }
      result = await response.json();
      console.log(result.accessToken);
      const token = result.accessToken;
      localStorage.setItem("token", token);
      document.getElementById("btnLoginClose").click();
      Swal.fire({
        icon: "success",
        text: "Login successful!",
        showConfirmButton: false,
        timer: 1500,
      }).then((result) => {
        document.location.reload(true);
      });
    })
    .catch(async (error) => {
      Swal.fire({
        icon: "error",
        title: error,
        showConfirmButton: false,
        timer: 1500,
      });
    });
}
async function fetchApiToken() {
  let token = localStorage.getItem('token') //mostrar token
  if (token) {
    let url = urlBase + "/newspapers";
    const myInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Bearer " + localStorage.getItem('token'),
      },
    };
    const myRequest = new Request(url, myInit);
    let selectBox = `<select name="newspapers" id="newspapers" class="form-select form-select-sml" onchange="getNews(this.value);">
						<option value="">NewsPapers</option>`;
    await fetch(myRequest).then(async function (response) {
      if (response.ok) {
        listNewspapers = await response.json();
        for (const newspaper of listNewspapers) {
          selectBox += `<option value="${newspaper.name}">${newspaper.name.replace(/-/g, " ").initCap()}</option>`
        }
        selectBox += `</select>`;
      } else {
        alert(response.error)
      }
    });
    document.getElementById("nespaperslist").innerHTML = selectBox;
    document.getElementById("isLogin").innerHTML += '<button type="button" class="btn btn-light" id="btnUsers" onclick="getUsers();">Users</button>'
    document.getElementById("isLogin").innerHTML += '<button type="button" class="btn btn-light" id="btnNewspapper" onclick="getAllNewspapers();">NewsPapers</button>'
    document.getElementById("isLogin").innerHTML += '<button type="button" class="btn btn-light" id="btnLogoff" onclick="logOff();">Sign Out</button>'
    document.getElementById("btnModalRegistar").style.display = "none"
    document.getElementById("btnModalLogin").style.display = "none"
    document.getElementById("token").innerHTML = `${token}`
  } else {
    document.getElementById("isLogin").style.display = "none";
    document.getElementById("nespaperslist").style.display = "none";
  }
}
fetchApiToken()

String.prototype.initCap = function () {
  return this.toLowerCase().replace(/(?:^|\s)[a-z]/g, function (m) {
    return m.toUpperCase();
  });
};