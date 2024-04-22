const express = require("express")

const app = express()
const server = app.listen(3000)

app.use(express.static("public"))

console.log("Server is running");

const io = require("socket.io")(server)


io.sockets.on("connection", (socket) => {
    console.log("New connection :) " + socket.id);

    snakes[socket.id] = { pos: newSpawnPosition() }

    socket.emit("world_info", { 
        id: socket.id,
        gridSize: GRID_SIZE, 
        gridWidth: GRID_WIDTH, 
        gridHeight: GRID_HEIGHT,
        ...snakes[socket.id].pos
    })

    socket.on("move", snake => {
        snakes[socket.id] = snake

        if (isDead(snake)) {
            snakes[socket.id].pos = newSpawnPosition()
            socket.emit("dead", snakes[socket.id].pos)
        }

        socket.broadcast.emit("move", snakes)
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected :(");
        delete snakes[socket.id]
    })
})

