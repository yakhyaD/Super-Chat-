const app = require('express')()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
const ent = require('ent') // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)

// Chargement de la page index.html
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/page.html');
});

io.sockets.on('connection', (socket, pseudo) => {
    // Dès qu'on nous donne un pseudo, on le stocke en variable de session et on informe les autres personnes
    socket.on('new_client', (pseudo) => {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('new_client', pseudo);
    })

    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', (message) => {
        message = ent.encode(message);
        socket.broadcast.emit('message', { pseudo: socket.pseudo, message: message })
    })
});

server.listen(3030);