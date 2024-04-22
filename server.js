let express = require("express")

let app = express()
let server = app.listen(3000)

app.use(express.static("public"))

console.log("Server is running");

let io = require("socket.io")(server)

const GRID_SIZE = 20
const GRID_WIDTH = 48
const GRID_HEIGHT = 27

let snakes = {}
let foodLocation = newFood()

io.sockets.on("connection", (socket) => {
    console.log("New connection :)");

    socket.on("move", data => {
        socket.broadcast.emit("move", data)
    })

    socket.emit("food_location", foodLocation)

    socket.on("food_eaten", () => {
        foodLocation = newFood()
        io.sockets.emit("food_location", foodLocation)
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected :(");
    })
})


function newFood() {
    return { x: Math.floor(Math.random() * GRID_WIDTH), y: Math.floor(Math.random() * GRID_HEIGHT), value: Math.ceil(Math.random() * 3)}
}

function isDead(snake) {
    const { pos } = snake

    if (pos.x < 0 || pos.x >= GRID_WIDTH || pos.y < 0 || pos.y >= GRID_HEIGHT) {
        return true
    }

    for (let i = 0; i < snake.body.length; i++) {
        if (snake.pos.x === snake.body[i].x && snake.pos.y === snake.body[i].y) {
            return true
        }
    }

    return false
}

function newSpawnPosition() {
    return { x: Math.floor(GRID_WIDTH / 3), y: Math.floor(GRID_HEIGHT / 2) }
}
































