const express = require("express")

const app = express()
const server = app.listen(3000)

app.use(express.static("public"))

console.log("Server is running");

const io = require("socket.io")(server)

const GRID_SIZE = 30
const GRID_WIDTH = 32
const GRID_HEIGHT = 18

let snakes = {}
let foodLocation = []

for (let i = 0; i < 10; i++) {
    foodLocation.push(newFood())
}

io.sockets.on("connection", (socket) => {
    console.log("New connection :) " + socket.id);

    snakes[socket.id] = { pos: newSpawnPosition() }

    socket.emit("world_info", { 
        id: socket.id,
        gridSize: GRID_SIZE, 
        gridWidth: GRID_WIDTH, 
        gridHeight: GRID_HEIGHT,
        ...snakes[socket.id].pos,
        foodCount: foodLocation.length
    })

    socket.emit("food_location", foodLocation)

    socket.on("move", snake => {
        snakes[socket.id] = snake

        if (isDead(socket.id)) {
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

function newFood() {
    return { ...getRandomLocation(), value: Math.ceil(Math.random() * 3)}
}

function isDead(socketId) {
    const snake = snakes[socketId]
    const { pos } = snake

    if (pos.x < 0 || pos.x >= GRID_WIDTH || pos.y < 0 || pos.y >= GRID_HEIGHT) {
        return true
    }

    for (const [enemyId, enemySnake] of Object.entries(snakes)) {
        if (enemyId === socketId) continue

        // Head on collision
        if (snake.pos.x === enemySnake.pos.x && snake.pos.y === enemySnake.pos.y) {
            snakes[enemyId].pos = newSpawnPosition()
            io.to(enemyId).emit("dead", snakes[enemyId].pos)
            return true
        }

        // Body collision
        if (enemySnake.body === undefined) continue

        for (bodyElem of enemySnake.body) {
            if (snake.pos.x === bodyElem.x && snake.pos.y === bodyElem.y) {
                return true
            }
        }
    }

    for (bodyElem of snake.body) {
        if (snake.pos.x === bodyElem.x && snake.pos.y === bodyElem.y) {
            return true
        }
    }

    return false
}

function newSpawnPosition() {
    // return { x: Math.floor(GRID_WIDTH / 2), y: Math.floor(GRID_HEIGHT / 2) }
    return getRandomLocation()
}
