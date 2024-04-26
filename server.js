const express = require("express")

const app = express()

const server = app.listen(3000)

app.use(express.static("public"))

console.log("Server is running");

const io = require("socket.io")(server, {
    cors: {
        origin: "https://riggle.onrender.com",
        methods: ["GET", "POST"]
    }
})

const GRID_SIZE = 30
const GRID_WIDTH = 70
const GRID_HEIGHT = 70

let snakes = {}
let foodLocation = []
let blocks = []

for (let i = 0; i < 100; i++) {
    foodLocation.push(newFood())
}

for (let i = 0; i < 20; i++) {
    blocks.push(getRandomLocation())
}

io.sockets.on("connection", (socket) => {
    console.log("New connection :) " + socket.id);

    socket.emit("world_info", { 
        id: socket.id,
        foodCount: foodLocation.length,
        blocks: blocks
    })

    socket.emit("food_location", foodLocation)

    socket.on("ready_to_play", () => {
        snakes[socket.id] = { pos: newSpawnPosition(), colourInt: Math.floor(Math.random() * 4) }
        socket.emit("player_info", snakes[socket.id])
    })

    socket.on("move", snake => {
        snakes[socket.id] = snake

        if (isDead(socket.id)) {
            delete snakes[socket.id]
            socket.emit("dead")

        } else {
            const [ ateFood, foodIndex ] = isEatingFood(socket.id)
            if (ateFood) {
                socket.emit("grow", { value: foodLocation[foodIndex].value })
                foodLocation[foodIndex] = newFood()
                io.sockets.emit("food_location", foodLocation)
            }
        }

        socket.broadcast.emit("move", snakes)
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected :(");
        delete snakes[socket.id]
        socket.broadcast.emit("move", snakes)
    })
})


function newFood() {
    let value
    let rand = Math.random() * 10

    if (rand < 5) {
        value = 1
    } else if (rand < 8) {
        value = 2
    } else {
        value = 3
    }

    return { ...getRandomLocation(), value: value }
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

        for (const bodyElem of enemySnake.body) {
            if (snake.pos.x === bodyElem.x && snake.pos.y === bodyElem.y) {
                return true
            }
        }
    }

    for (const bodyElem of snake.body) {
        if (snake.pos.x === bodyElem.x && snake.pos.y === bodyElem.y) {
            return true
        }
    }

    for (const block of blocks) {
        if (snake.pos.x === block.x && snake.pos.y === block.y) {
            return true
        }
    }

    return false
}


function newSpawnPosition() {
    let pos = getRandomLocation()
    pos.x = Math.max(3, Math.min(pos.x, GRID_WIDTH-3))
    pos.y = Math.max(3, Math.min(pos.y, GRID_HEIGHT-3))
    return pos
}


function isEatingFood(socketId) {
    for (const [i, foodItem] of foodLocation.entries()) {
        const { x, y } = snakes[socketId].pos
        if (x === foodItem.x && y === foodItem.y) {
            return [ true, i ]
        }
    }

    return [ false, null ]
}


function isOccupiedSquare(x, y) {
    for (const [_, snake] of Object.entries(snakes)) {
        if (x === snake.pos.x && y === snake.pos.y) {
            return true
        }

        if (snake.body === undefined) continue

        for (const bodyElem of snake.body) {
            if (x === bodyElem.x && y === bodyElem.y) {
                return true
            }
        }
    }

    for (const foodItem of foodLocation) {
        if (x === foodItem.x && y === foodItem.y) {
            return true
        }
    }

    return false
}

function getRandomLocation() {
    let x, y

    do {
        x = Math.floor(Math.random() * GRID_WIDTH)
        y = Math.floor(Math.random() * GRID_HEIGHT)
    } while (isOccupiedSquare(x, y))

    return { x, y }
}
















































