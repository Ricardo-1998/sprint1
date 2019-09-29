const mongoose = require('mongoose'); //libreria para el manejo a la conexion de bases de datos
const User = require("../models/users"); //modelo usuarios.
const AuthController = {}; // objeto que tendra la logica de nuestra web
const bcrypt = require('bcrypt'); //libreria para encriptar
const fs = require('fs.extra');


AuthController.login = function (req, res, next) {
    res.render('signin'); //
}  

/*nos devuelve la vista signiup para crear al usuario*/
AuthController.create = function (req, res, next) {
    res.render('signup')
}

/*Para crear el usuario*/
AuthController.store = async function (req, res) {
    //obteniendo los datos del usuario
    let user = {
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        seguridad: {
            pregunta: req.body.pregunta,
            respuesta: req.body.respuesta
        },
        nombre:req.body.name,
        apellido:req.body.apellido,
        sexo:req.body.sexo,
        imagen: '/images/pf.png'
    }
    
    /*alamcenando el usuario*/
    await User.create(user, (error, user) => { 
        if (error) // si se produce algun error
            //Devolvemos una vista con los mensajes de error
            return res.render('error2', { err: error, email: user.email });          
        else {
            //Almacenamos los datos de la consulta en el objeto data
            console.log("Deberia de entrar");
            let data = {
                userId: user._id.toString(),
                email: user.email,
                password: user.password,
                username: user.username,
                seguridad: {
                    pregunta: user.seguridad.pregunta,
                    respuesta: user.seguridad.respuesta
                },
                nombre:user.nombre,
                apellido:user.apellido,
                sexo:user.sexo,
                imagen: user.imagen
            }
            //console.log(data.seguridad.pregunta);
            //con 10 le indicamos cuantas veces realizara la encriptación
            bcrypt.hash(data.userId, 10, function (err, hash) {
                if (err) { //si produce un error
                    next(err); // retornaremos el error
                }
                
                data.userId = hash; // almacenamos la password encriptada
                //parseamos el objeto json a cadena y lo alamcenamos en la variable session
                req.session.user = JSON.stringify(data);
                console.log(req.session.user);
                //nos dirigira a la pagina donde se encuentra el perfil del usuario
                return res.redirect('/users/profile');
            });
        }
    })

};

AuthController.profile = function (req, res) {
    return res.render('profile');
}


/*Para ingresar al sistema*/
AuthController.signin = function (req, res,next) {
    var data = {};
    //user autentication es el metodo que nos permitira ingresar al sistema
    User.authenticate(req.body.email, req.body.password, (error, user) => {
        if (error || !user) {
            return res.render('error2', { err: error, email: req.body.email });
            //return res.send("Usuario ya existente");
            //return res.send({ err: error, email: user.email });
        }
        else {
            data.userId= user._id.toString(),
            data.email= user.email,
            data.password=user.password,
            data.username=user.username,
            data.seguridad= {
                pregunta: user.pregunta,
                respuesta: user.respuesta
            },
            data.nombre=user.name,
            data.apellido=user.apellido,
            data.sexo=user.sexo,
            data.imagen = user.imagen

       
            
            //este método nos encriptara el userId para que sea alamcenado en la sesion
            bcrypt.hash(data.userId, 10, function (err, hash) {
                if (err) {
                    next(err);
                }
                data.userId = hash;
                //parseamos el objeto a cadena
                req.session.user = JSON.stringify(data);
                //si es correcto nos dirigira al perfil del usuario que esta ingresando.
                return res.redirect('/users/profile');
            });

            

        }
    });
};

AuthController.logout = function (req, res, next) {
    if (req.session) { //si la session existe
        req.session.destroy(function (err) { // destruimos la sesion
            if (err) { // si produce un error
                next(err);
            }
            else { //si la sesion se destruyo nos dirigira al index
                res.redirect('/');
            }
        });
    }
}


AuthController.volver = function (req, res) {
    req.render('index');
}
module.exports = AuthController;

AuthController.update = function (req, res) {
    var sess = req.session;
    var sessUser = JSON.parse(sess.user);
    let update = {};

    if(req.files.imagen.name == ""){
        var extension = sessUser.imagen;
    }

    else{
        extension = "/images/" + req.files.imagen.name;
    }
    
    console.log(extension);

    if(!req.body.name && !req.body.email && !req.body.username){
        var nombre = sessUser.name;
        var email = sessUser.email;
        var username = sessUser.username;
    }

    else{
        nombre = req.body.name;
        email = req.body.email;
        username = req.body.username;
    }

    update = {
        nombre: nombre,
        email: email,
        username: username,
        imagen: extension
    };


    sessUser.nombre = update.nombre;
    sessUser.email = update.email;
    sessUser.username = update.username;
    sessUser.imagen = update.imagen;

    User.updateOne({"email": JSON.parse(req.session.user).email.toString()}, update, function(err){
        if(err){
            res.status(500);
            res.json({code:500, err});
        } else {

            if(extension != ""){
                fs.copy(req.files.imagen.path, "public/" + extension);
            }

            req.session.user = JSON.stringify(sessUser);
            req.session.save(function(err){
                if(err){
                    res.status(500);
                    res.json({code:500, err});
                } else {
                    console.log("Modificacion realizada");
                    res.render('profileGeneral');
                }
            });
        }
    });
}

AuthController.changePassword = function(req, res) {
    var sessUser = JSON.parse(req.session.user);

    bcrypt.compare(req.body.passwordAntigua, JSON.parse(req.session.user).password, function(err, result){
        if(err){
            res.status(500);
            res.json({code:500, err});
        } else {
            if(result == true){                
                bcrypt.hash(req.body.passwordNueva, 10, function(err, hash){
                    if(err){
                        next(err);
                    }

                    sessUser.password = hash;
                    req.session.user = JSON.stringify(sessUser);

                    let update = {
                        password: hash
                    }

                    User.updateOne({"email": sessUser.email.toString()}, update, function(err){
                        if(err){
                            res.status(500);
                            res.json({code:500, err});
                        } else {
                            console.log("Contrasena cambiada. Cambios efectuados.")
                            return res.redirect('/profile/seguridad');
                        }
                    });  
                });
            } else {
                console.log("La password no coincide. Cambios no realizados.");
                res.redirect('/profile/seguridad');
            }
        }
    });
};

module.exports = AuthController;

