const urlBase = "http://localhost:8000/api";
const listaNewspapper = document.getElementById("ListaNewspappers");

async function getNews() {
    let url = urlBase + "/news";

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
            listaNewspapper.innerHTML = "Não posso mostrar as noticias de momento!";
        } else {
            newspappers = await response.json();
            let texto = `<section id="cast" class="py-5 text-center">
                            <div class="article">
                            <div class="container">
                          <div id="listNews" class="row" >`;
            let logoNews = "";
            let titulo = "";
            for (const newspapper of newspappers.sort(() => Math.random() - 0.2)) {
                auxNews = newspapper.title.replaceAll(/\s/g, '');
                if (auxNews != ''
                    && auxNews != 'Tecnologia'
                    && !auxNews.match(/coment�rios*/)
                    && !newspapper.url.match(/hamburger*./)) {
                    switch (newspapper.source) {
                        case 'jornal-de-noticias':
                            logoNews = '../img/jornaldenoticias.png';
                            break;
                        case 'jornal-de-negocios':
                            logoNews = '../img/jornaldenegocios.png';
                            break;
                        case 'publico':
                            logoNews = '../img/publico.png';
                            break;
                        case 'sapo':
                            logoNews = '../img/sapo.png';
                            break;

                    }
                    //logoNews = '../img/'+newspapper.img;
                    titulo = newspapper.title;
                    if (titulo.length > 60) {
                        titulo = titulo.substring(0, 60) + ' . . .';
                    }
                    texto += ` 
                    <div class="col-xl-3 col-md-6 mb-4" data-toggle="modal" >
                    <div class="card border-0 shadow">
                    <img src="${logoNews}" class="card-img-top" alt="..." onclick="getNewspapper('${newspapper.url}');">
                    <div class="card-body text-center">
                    <h4>${titulo}</h4>
                    <div class="card-text text-black-50">
                    <strong>URL:</strong> ${newspapper.url}
                    </div>
                    <strong>Fonte:</strong> ${newspapper.source}
                    </div></div></div>`;
                }
                listaNewspapper.innerHTML = texto;
            }
            listaNewspapper.innerHTML += '</div></div></div></section>'
        }
    });
}

async function getAllNewspapers() {
    let url = urlBase + "/newspapers";
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
            listaNewspapper.innerHTML = "Não posso mostrar os jornais de momento!";
        } else {
            listNewspapers = await response.json();
            let tabela = `<button
                                type="button"
                                id="createNewspaper"
                                class="btn btn-primary"
                                onclick="createNewspaper()"
                            >
                                 Criar
                          </button>
                    <table class="table">
                      <thead class="thead-dark">
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Nome</th>
                          <th scope="col">URL</th>
                          <th scope="col">base</th>
                          <th scope="col">img</th>
                        </tr>
                      </thead>
                      <tbody>`;
            for (const newspaper of listNewspapers) {
                tabela += `<tr>
                    <th scope="row"><a href="javascript:editNewspaper('${newspaper.name}','${newspaper.address}','${newspaper.base}','${newspaper.img}');"><i class="fas fa-newspaper"></i></a></th>
                    <td>${newspaper.name}</td>
                    <td>${newspaper.address}</td>
                    <td>${newspaper.base}</td>
                    <td><img src="../img/${newspaper.img}" height="20"></td>`;
            }
            tabela += `</tbody>
               </table>`;

            swal.fire(
                {
                    title: "Lista de Jornais",
                    width: "800px",
                    showCancelButton: false,
                    confirmButtonText: "Fechar",
                    cancelButtonText: "Fechar",
                    html: tabela,
                });
        }
    });

}

function getNewspapper(url) {
    alert(url);
    window.open(url, 'popUpWindow', 'height=400,width=600,left=10,top=10,,scrollbars=yes,menubar=no');
    return false;
    location.href = url;
}

function editNewspaper(v_nome, v_address, v_base, v_img) {

    swal.fire(
        {
            title: "NewsPaper",

            showCancelButton: true,
            confirmButtonText: "Gravar",
            confirmButtonColor: "#218838",
            cancelButtonText: "Fechar",
            html: ' <form id="movieForm">' +
                '<div class="form-group">' +
                '<img src="../img/' + v_img + '" height="60">' +
                '</div><br><br>' +
                '<div class="form-group">' +
                'Name<div name="name" id="name" class="form-control input-sm" >' +
                v_nome +
                '</div>' +
                "</div><br>" +
                '<div class="form-group">Address' +
                ' <input type="text" name="address" id="address" class="form-control input-sm" placeholder="Address" value="' +
                v_address +
                '">' +
                "</div><br>" +
                '<div class="form-group">Base' +
                ' <input type="text" name="base" id="base" class="form-control input-sm" placeholder="Base" value="' +
                v_base +
                '">' +
                "</div><br>" +
                '<div class="form-group">Image' +
                ' <input type="text" name="img" id="img" class="form-control input-sm" placeholder="ii" value="' +
                v_img +
                '">' +
                "</div><br>" +
                "</form>",
            preConfirm: () => {
                let error_msg = "";

                if (!document.getElementById("address").value) {
                    error_msg += "Address is required.<br>";
                }
                if (error_msg) {
                    Swal.showValidationMessage(error_msg);
                }
            },
        }).then((result) => {
            if (!result.isConfirmed) {
                getAllNewspapers();
            } else {
                const address = document.getElementById("address").value;
                const base = document.getElementById("base").value;
                let img = null;
                if (document.getElementById("img").value == "") {
                    img = v_img;
                } else {
                    img = document.getElementById("img").value
                }
                fetch(`${urlBase}/newspaper/${v_nome}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": "Bearer " + localStorage.getItem('token'),
                    },
                    body: `address=${address}&base=${base}&img=${img}`,
                })
                    .then(async (response) => {
                        if (!response.ok) {
                            erro = response.statusText;
                            statReg.innerHTML = response.statusText;
                            throw new Error(erro);
                        }
                        Swal.fire({
                            icon: "success",
                            title: v_nome,
                            text: "Gravado com sucesso!",
                            showConfirmButton: false,
                            timer: 1500,
                        }).then((result) => {
                            getAllNewspapers();
                        });
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Erro ao alterar o jornal!<br>" + error,
                            showConfirmButton: false,
                            timer: 3500,
                        }).then((result) => {
                            getAllNewspapers();
                        });
                    });

            }
        });
}

function createNewspaper() {

    swal.fire(
        {
            title: "NewsPaper",

            showCancelButton: true,
            confirmButtonText: "Gravar",
            confirmButtonColor: "#218838",
            cancelButtonText: "Fechar",
            html: ' <form id="movieForm">' +
                '<div class="form-group">' +
                '<i class="fas fa-newspaper fa-5x"></i>' +
                '</div><br><br>' +
                '<div class="form-group">' +
                'Name<input type="text" name="name" id="name" class="form-control input-sm" placeholder="Name" value="">' +
                '</div><br>' +
                '<div class="form-group">Address' +
                ' <input type="text" name="address" id="address" class="form-control input-sm" placeholder="Address" value="">' +
                "</div><br>" +
                '<div class="form-group">Base' +
                ' <input type="text" name="base" id="base" class="form-control input-sm" placeholder="Base" value="">' +
                "</div><br>" +
                '<div class="form-group">Image' +
                ' <input type="file" name="img" id="img" class="form-control input-sm" placeholder="image" value="">' +
                '</div><br>' +
                '</form>',
            preConfirm: () => {
                let error_msg = "";
                if (!document.getElementById("name").value) {
                    error_msg += "Name is required.<br>";
                }
                if (!document.getElementById("address").value) {
                    error_msg += "Address is required.<br>";
                }
                if (!document.getElementById("img").value) {
                    error_msg += "Image is required.<br>";
                }
                if (error_msg) {
                    Swal.showValidationMessage(error_msg);
                }
            },
        }).then((result) => {
            if (!result.isConfirmed) {
                getAllNewspapers();
            } else {
                const name = document.getElementById("name").value;
                const address = document.getElementById("address").value;
                const base = document.getElementById("base").value;
                const img = document.getElementById("img").files[0].name;
                fetch(`${urlBase}/newspaper/`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "Authorization": "Bearer " + localStorage.getItem('token'),
                    },
                    body: `name=${name}&address=${address}&base=${base}&img=${img}`,
                })
                    .then(async (response) => {
                        if (!response.ok) {
                            erro = response.statusText;
                            statReg.innerHTML = response.statusText;
                            throw new Error(erro);
                        }

                        req.send(formData);
                        Swal.fire({
                            icon: "success",
                            title: name,
                            text: "Criado com sucesso!",
                            showConfirmButton: false,
                            timer: 1500,
                        }).then((result) => {
                            getAllNewspapers();
                        });
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Erro ao criar o jornal!<br>" + error,
                            showConfirmButton: false,
                            timer: 3500,
                        }).then((result) => {
                            getAllNewspapers();
                        });
                    });

            }
        });
}