function guardar() {
    let data = {
        nombre: document.getElementById("nombre").value,
        Artista: document.getElementById("Artista").value,
        Album: document.getElementById("Album").value
    };
    console.log(data.nombre);
    let tbody = document.getElementsByClassName("posts")[0];
    let tr = document.createElement("tr");
    tr.className = "cancion";
    tr.id = "tr";
    tr.innerHTML = `<td>
                        <input id="nombre" name="nombre" value="${data.nombre}" type="text"></td>
                    <td> 
                    <input id="artista" name="artista" value="${data.Artista}" type="text"></td>
                    <td>
                    <input id="album" name="album" value="${data.Album}" type="text"></td>`;
    tbody.appendChild(tr)
};

window.onload = () => {
    app.init();
};
let app = {

    init: function () {
        this.playlist();
        this.mostrarForos();
        this.foroUser();
        this.mostrarPlaylist();
    },

    playlist: function () {
        fetch('/api/play', {
            method: "GET"
        }).then(res => res.json())
            .then(respond => {
                //console.log(respond);
                let array = [];
                let len = respond.playlist.length;
                for (let i = 0; i < len; i++) {
                    let aut = respond.playlist[i].usuario;
                    array.push(aut);
                }
                var glob = document.getElementById("global12").innerText;
                var contPlaylist = 0;
                array.forEach(element => {
                    contPlaylist++;
                });
                for (let i = 0; i < contPlaylist; i++) {
                    if (glob == respond.playlist[i].usuario) {
                        let data = {
                            id: (respond.playlist[i])._id,
                            titulo: (respond.playlist[i]).titulo,
                            extension: (respond.playlist[i]).imagenExtension,
                            usuario: respond.playlist[i].usuario
                        };
                        let divP = document.getElementById('playlist-U');
                        let div = document.createElement("div");
                        div.innerHTML = `<div class="col s6">
                                            <div class="card">
                                                <div class="card-image">
                                                    <img src="/images/${data.extension}" alt="imagenPlaylist">
                                                    <h5>${data.titulo}</h5>
                                                    <p>Autor: ${data.usuario}</p>
                                                </div>
                                                <div class="card-action">
                                                    <a href="#" class="delete">Eliminar</a>
                                                </div>
                                            </div>
                                        </div>`;
                        div.getElementsByClassName("delete")[0].addEventListener("click", (event) => {
                            this.deletePlaylist(event, data, div, divP);
                        });
                        divP.appendChild(div);
                    }
                }
            })
    },
    deletePlaylist: (event, data, div, divP) => {
        event.preventDefault();
        console.log(data.id);
        fetch('/api/play/' + data.id, {
            method: 'DELETE'
        }).then(res => res.json())
            .then(res => {
                if (res.ok) {
                    divP.removeChild(div);
                }
            })
    },

    mostrarPlaylist: function () {
        fetch('/api/play', {
            method: "GET"
        }).then(res => res.json())
            .then(response => {
                console.log(response);
                for (let i = 0; i < 3; i++) {
                    let data = {
                        tit: (response.playlist[i]).titulo,
                        img: (response.playlist[i]).imagenExtension,
                        usr: (response.playlist[i]).usuario,
                        galeria: (response.playlist[i]).galeria
                    };
                    let tbody = document.getElementById("div123");
                    let div2 = document.createElement("div");
                    var cancion ="";
                    for(let j = 0; j< data.galeria.length; j++){                      
                        var cancion = "<tr>"+
                                            "<td>"+data.galeria[j].nombre+"</td>"+
                                            "<td>"+data.galeria[j].album+"</td>"+
                                            "<td>"+data.galeria[j].artista+"</td>"+"</tr>"+cancion;
                    }
                    div = `<div class="card" style = "background-color: #40445a">
                                        <div class="card-content cancion3" >
                                            <img src = "images/${data.img}" style = "width: 100%">
                                            <h5>${data.tit}</h5>
                                            <p>${data.usr}</p>
                                            <table>
                                                <thead>
                                                    <th>Nombre</th>
                                                    <th>Album</th>
                                                    <th>Artista</th>
                                                </thead>
                                                <tbody>
                                                `;
                    div += cancion+ "</tbody>"+"</table>"+"</div>"+"</div>"
                    div2.innerHTML = div;
                    tbody.appendChild(div2);
                }
            })
    },

    foroUser: function () {
        fetch('/api/post', {
            method: "GET"
        }).then(res => res.json())
            .then(respond => {
                let array = [];
                let len = respond.posts.length;
                for (let i = 0; i < len; i++) {
                    let aut = respond.posts[i].autor;
                    array.push(aut);
                }
                var glob = document.getElementById("global12").innerText;
                var contForos = 0;
                array.forEach(element => {
                    contForos++;
                });
                for (let i = 0; i < contForos; i++) {
                    if (glob == respond.posts[i].autor) {
                        let data = {
                            id: (respond.posts[i])._id,
                            tit: (respond.posts[i]).titulo,
                            cuer: (respond.posts[i]).texto,
                            aut: (respond.posts[i]).autor
                        };
                        let tbody = document.getElementById('profile-F');
                        let div = document.createElement("div");
                        div.innerHTML = `<div class="col s6" >
                                            <div class="card ">
                                                <div class="card-content grey lighten-1">
                                                    <h5>${data.tit}</h5>
                                                    <p>${data.cuer}</>
                                                </div>
                                                <div class="card-action">
                                                    <a href="#" class="delete">Eliminar</a>
                                                </div>
                                            </div>
                                        </div>`;
                        div.getElementsByClassName("delete")[0].addEventListener("click", (event) => {
                            this.deleteForos(event, data, div, tbody);
                        });
                        tbody.appendChild(div);
                    }
                }
            })
    },
    deleteForos: (event, data, div, tbody) => {
        event.preventDefault();
        fetch('/api/post/' + data.id, {
            method: 'DELETE'
        }).then(res => res.json())
            .then(res => {
                if (res.ok) {
                    tbody.removeChild(div);
                }
            })
    },
    mostrarForos: function () {
        fetch('/api/post', {
            method: "GET"
        }).then(res => res.json())
            .then(response => {
                //var respo = [];
                // respo.add(response[i])
                let cont = 1;
                for (let i = 0; i < 3; i++) {
                    //respo.add(respones.posts[i]);
                    let idd = 'modal';

                    let hash = '#';
                    //console.log(response.posts);
                    let data = {
                        tit: (response.posts[i]).titulo,
                        cuer: (response.posts[i]).texto,
                        aut: (response.posts[i]).autor
                    };
                    let tbody = document.getElementById("sec1");
                    let div = document.createElement("div");
                    div.innerHTML = `<div class="sectionn">
                                    <div class="">
                                        <div class="card-panel" style = "background-color: #40445a">
                                            <a class="linkss waves-effect waves-light btn modal-trigger" href="${hash + idd + cont}">
                                                ${data.tit}</a>
                                            <a class="linkss waves effect waves-light">${data.aut}</a>
                                            <p>${data.cuer}</p>       
                                            </div>
                                        </div>
                                    </div>
                                </div>`;
                    cont = cont + 1;
                    tbody.appendChild(div);
                }
            })
    }
}

function mostrar0() {
    fetch('/api/post', {
        method: "GET"
    }).then(res => res.json())
        .then(response => {
            //var respo = [];
            // respo.add(response[i])
            let parent = document.getElementById("sec1");
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            };
            parent.innerHTML = `<ul class="pagination" style="position: absolute; left: 25%; bottom: 0;">
                                    <li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>
                                    <li class="active"><a href="#!">1</a></li>
                                    <li class="waves-effect"><a href="#!" onClick="mostrar1()">2</a></li>
                                    <li class="waves-effect"><a href="#!" onClick="mostrar2()">3</a></li>
                                    <li class="waves-effect"><a href="#!" onClick="mostrar3()">4</a></li>
                                    <li class="waves-effect"><a href="#!" onClick="mostrar4()">5</a></li>
                                    <li class="waves-effect"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
                                </ul>`;
            let cont = 1;
            console.log(response.length);
            for (let i = 0; i < 3; i++) {
                //respo.add(respones.posts[i]);
                let idd = 'modal';

                let hash = '#';
                console.log(response.posts);
                let data = {
                    tit: (response.posts[i]).titulo,
                    cuer: (response.posts[i]).texto,
                    aut: (response.posts[i]).autor
                };
                let tbody = document.getElementById("sec1");
                let div = document.createElement("div");
                div.innerHTML = `<div class="sectionn">
                                    <div class="">
                                    <div class="card-panel" style = "background-color: #40445a">
                                    <a class="linkss waves-effect waves-light btn modal-trigger" href="${hash + idd + cont}">
                                        ${data.tit}</a>
                                    <a class="linkss waves effect waves-light">${data.aut}</a>
                                    <p>${data.cuer}</p>       
                                    </div>
                                </div>
                                    </div>
                                </div>`;
                cont = cont + 1;
                tbody.appendChild(div);
            }
        })
}

function mostrar1() {
    fetch('/api/post', {
        method: "GET"
    }).then(res => res.json())
        .then(response => {
            //var respo = [];
            // respo.add(response[i])
            let parent = document.getElementById("sec1");
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            };
            parent.innerHTML = `<ul class="pagination" style="position: absolute; left: 25%; bottom: 0;">
                                    <li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>
                                    <li class="waves-effect"><a href="#!" onClick='mostrar0()'>1</a></li>
                                    <li class="active"><a href="#!">2</a></li>
                                    <li class="waves-effect"><a href="#!" onClick='mostrar2()'>3</a></li>
                                    <li class="waves-effect"><a href="#!" onClick='mostrar3()'>4</a></li>
                                    <li class="waves-effect"><a href="#!" onClick='mostrar4()'>5</a></li>
                                    <li class="waves-effect"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
                                </ul>`;
            let cont = 1;
            console.log(response.length);
            for (let i = 3; i < 6; i++) {
                //respo.add(respones.posts[i]);
                let idd = 'modal';

                let hash = '#';
                console.log(response.posts);
                let data = {
                    tit: (response.posts[i]).titulo,
                    cuer: (response.posts[i]).texto,
                    aut: (response.posts[i]).autor
                };
                let tbody = document.getElementById("sec1");
                let div = document.createElement("div");
                div.innerHTML = `<div class="sectionn">
                                    <div class="">
                                    <div class="card-panel" style = "background-color: #40445a">
                                    <a class="linkss waves-effect waves-light btn modal-trigger" href="${hash + idd + cont}">
                                        ${data.tit}</a>
                                    <a class="linkss waves effect waves-light">${data.aut}</a>
                                    <p>${data.cuer}</p>       
                                    </div>
                                </div>
                                    </div>
                                </div>`;
                cont = cont + 1;
                tbody.appendChild(div);
            }
        })
}

function mostrar2() {
    fetch('/api/post', {
        method: "GET"
    }).then(res => res.json())
        .then(response => {
            //var respo = [];
            // respo.add(response[i])
            let parent = document.getElementById("sec1");
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            };
            parent.innerHTML = `<ul class="pagination" style="position: absolute; left: 25%; bottom: 0;">
                                    <li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>
                                    <li class="waves-effect"><a href="#!" onClick="mostrar0()">1</a></li>
                                    <li class="waves-effect"><a href="#!" onClick="mostrar1()">2</a></li>
                                    <li class="active"><a href="#!">3</a></li>
                                    <li class="waves-effect"><a href="#!" onClick="mostrar3()">4</a></li>
                                    <li class="waves-effect"><a href="#!" onClick="mostrar4()">5</a></li>
                                    <li class="waves-effect"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
                                </ul>`;
            let cont = 1;
            console.log(response.length);
            for (let i = 6; i < 9; i++) {
                //respo.add(respones.posts[i]);
                let idd = 'modal';
                let hash = '#';
                console.log(response.posts);
                let data = {
                    tit: (response.posts[i]).titulo,
                    cuer: (response.posts[i]).texto,
                    aut: (response.posts[i]).autor
                };
                let tbody = document.getElementById("sec1");
                let div = document.createElement("div");
                div.innerHTML = `<div class="sectionn">
                                    <div class="">
                                    <div class="card-panel" style = "background-color: #40445a">
                                    <a class="linkss waves-effect waves-light btn modal-trigger" href="${hash + idd + cont}">
                                        ${data.tit}</a>
                                    <a class="linkss waves effect waves-light">${data.aut}</a>
                                    <p>${data.cuer}</p>       
                                    </div>
                                </div>
                                    </div>
                                </div>`;
                cont = cont + 1;
                tbody.appendChild(div);
            }
        })
}
function mostrar3() {
    fetch('/api/post', {
        method: "GET"
    }).then(res => res.json())
        .then(response => {
            //var respo = [];
            // respo.add(response[i])
            let parent = document.getElementById("sec1");
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            };
            parent.innerHTML = `<ul class="pagination" style="position: absolute; left: 25%; bottom: 0;">
                                    <li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>
                                    <li class="waves-effect"><a href="#!" onClick="mostrar0()">1</a></li>
                                    <li class="waves-effect"><a href="#!" onClick="mostrar1()">2</a></li>
                                    <li class="active"><a href="#!>3</a></li>
                                    <li class="waves-effect"><a href="#!" onClick="mostrar3()>4</a></li>
                                    <li class="waves-effect"><a href="#!" onClick="mostrar4()">5</a></li>
                                    <li class="waves-effect"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
                                </ul>`;
            let cont = 1;
            console.log(response.length);
            for (let i = 9; i < 12; i++) {
                //respo.add(respones.posts[i]);
                let idd = 'modal';
                let hash = '#';
                console.log(response.posts);
                let data = {
                    tit: (response.posts[i]).titulo,
                    cuer: (response.posts[i]).texto,
                    aut: (response.posts[i]).autor
                };
                let tbody = document.getElementById("sec1");
                let div = document.createElement("div");
                div.innerHTML = `<div class="sectionn">
                                    <div class="">
                                    <div class="card-panel" style = "background-color: #40445a">
                                    <a class="linkss waves-effect waves-light btn modal-trigger" href="${hash + idd + cont}">
                                        ${data.tit}</a>
                                    <a class="linkss waves effect waves-light">${data.aut}</a>
                                    <p>${data.cuer}</p>       
                                    </div>
                                </div>
                                    </div>
                                </div>`;
                cont = cont + 1;
                tbody.appendChild(div);
            }
        })
}
function mostrar3() {
    fetch('/api/post', {
        method: "GET"
    }).then(res => res.json())
        .then(response => {
            //var respo = [];
            // respo.add(response[i])
            let parent = document.getElementById("sec1");
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            };
            parent.innerHTML = `<ul class="pagination" style="position: absolute; left: 25%; bottom: 0;">
                                    <li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>
                                    <li class="waves-effect"><a href="#!" onClick="mostrar0()">1</a></li>
                                    <li class="waves-effect"><a href="#!" onClick="mostrar1()">2</a></li>
                                    <li class="waves-effect"><a href="#!" onClick="mostrar2()">3</a></li>
                                    <li class="active"><a href="#!">4</a></li>
                                    <li class="waves-effect"><a href="#!" onClick="mostrar4()">5</a></li>
                                    <li class="waves-effect"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
                                </ul>`;
            let cont = 1;
            console.log(response.length);
            for (let i = 12; i < 15; i++) {
                //respo.add(respones.posts[i]);
                let idd = 'modal';
                let hash = '#';
                console.log(response.posts);
                let data = {
                    tit: (response.posts[i]).titulo,
                    cuer: (response.posts[i]).texto,
                    aut: (response.posts[i]).autor
                };
                let tbody = document.getElementById("sec1");
                let div = document.createElement("div");
                div.innerHTML = `<div class="sectionn">
                                    <div class="">
                                    <div class="card-panel" style = "background-color: #40445a">
                                    <a class="linkss waves-effect waves-light btn modal-trigger" href="${hash + idd + cont}">
                                        ${data.tit}</a>
                                    <a class="linkss waves effect waves-light">${data.aut}</a>
                                    <p>${data.cuer}</p>       
                                    </div>
                                </div>
                                    </div>
                                </div>`;
                cont = cont + 1;
                tbody.appendChild(div);
            }
        })
}
function mostrar4() {
    fetch('/api/post', {
        method: "GET"
    }).then(res => res.json())
        .then(response => {
            //var respo = [];
            // respo.add(response[i])
            let parent = document.getElementById("sec1");
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            };
            parent.innerHTML = `<ul class="pagination" style="position: absolute; left: 25%; bottom: 0;">
                                    <li class="disabled"><a href="#!"><i class="material-icons">chevron_left</i></a></li>
                                    <li class="waves-effect"><a href="#!" onClick="mostrar0()">1</a></li>
                                    <li class="waves-effect"><a href="#!" onClick="mostrar1()">2</a></li>
                                    <li class="waves-effect"><a href="#!" onClick="mostrar2()">3</a></li>
                                    <li class="waves-effect"><a href="#!" onClick="mostrar3()">4</a></li>
                                    <li class="active"><a href="#!">5</a></li>
                                    <li class="waves-effect"><a href="#!"><i class="material-icons">chevron_right</i></a></li>
                                </ul>`;
            let cont = 1;
            console.log(response.length);
            for (let i = 15; i < 18; i++) {
                //respo.add(respones.posts[i]);
                let idd = 'modal';
                let hash = '#';
                console.log(response.posts);
                let data = {
                    tit: (response.posts[i]).titulo,
                    cuer: (response.posts[i]).texto,
                    aut: (response.posts[i]).autor
                };
                let tbody = document.getElementById("sec1");
                let div = document.createElement("div");
                div.innerHTML = `<div class="sectionn">
                                    <div class="">
                                    <div class="card-panel" style = "background-color: #40445a">
                                    <a class="linkss waves-effect waves-light btn modal-trigger" href="${hash + idd + cont}">
                                        ${data.tit}</a>
                                    <a class="linkss waves effect waves-light">${data.aut}</a>
                                    <p>${data.cuer}</p>       
                                    </div>
                                </div>
                                    </div>
                                </div>`;
                cont = cont + 1;
                tbody.appendChild(div);
            }
        })
} 
