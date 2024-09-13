const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const server = http.createServer(app);

const io = socketIo(server);
const appRoute = require("./Routes/route");
const { handlePurchase } = require('./Controller/controller');

const PORT = process.env.PORT || 4000;


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.json());


const connectDB = require('./DB/connect');
connectDB();


app.use('/', appRoute);


io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

 
    socket.on('purchase', (data) => {
        handlePurchase(socket, data);
    });


    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});


app.get('/', (req, res) => {
    res.send('Hello everyone, Your name');
});


server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
