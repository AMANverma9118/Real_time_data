const io = require('socket.io')(server); // Assuming you already have a server

const { handlePurchase } = require('../Controller/controller'); // Import the handlePurchase function

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listen for 'purchase' events from clients
    socket.on('purchase', (data) => {
        handlePurchase(socket, data);  // Pass 'socket' and 'data' to the function
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
