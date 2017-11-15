# Sockardry

Extension for socket.io providing useful helper functions and a Request class that can be used like an AJAX request
including promises like `.done()`, `.failure()` or `.success()`

### Example Server implementation
```
    const sockardry = require('sockardry');
    const io = require('socket.io');

    io.on('connection', (socket) => {
        sockardry.enchant(socket); // you can also extend the prototype by using .extend(socket.__proto__);
        socket.sendRequest('subject', { message: 'socket wizardry!'})
            .success((r) => { /* success! */ })
            .failure((r) => { /* fail :( */ )})
            .done((r) => { /* .done() is always fired, independet of whether the request failed or not. */ });
    });
```
