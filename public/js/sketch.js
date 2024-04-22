let socket
let connected = false

let s
let food

let enemies = []

function setup() {
    createCanvas(GRID_SIZE * GRID_WIDTH, GRID_SIZE * GRID_HEIGHT)

    socket = io.connect("http://localhost:3000")
    let id

    socket.on("world_info", data => {
        connected = true
        id = data.id
        GRID_SIZE = data.gridSize
        GRID_WIDTH = data.gridWidth
        GRID_HEIGHT = data.gridHeight

        s = new Snake(data.x, data.y, GRID_SIZE)
    })

    socket.on("move", snakes => {
        delete snakes[id]

        enemies = []
        for (const [_, snakeInfo] of Object.entries(snakes)) {
           let enemy = new Snake(snakeInfo.pos.x, snakeInfo.pos.y, GRID_SIZE, true) 
           enemy.body = snakeInfo.body
           enemies.push(enemy)
        }
    })

    socket.on("dead", newPos => {
        s.reset(newPos.x, newPos.y)
    })

    socket.on("food_location", data => {
        food.pos = createVector(data.x, data.y)
        food.value = data.value
    })

    food = new Food(GRID_SIZE)


}

function keyPressed() {
    if (keyCode === LEFT_ARROW || keyCode === 65) {
        s.move(-1, 0)
    } 
    if (keyCode === RIGHT_ARROW || keyCode === 68) {
        s.move(1, 0)
    } 
    if (keyCode === UP_ARROW || keyCode === 87) {
        s.move(0, -1)
    } 
    if (keyCode === DOWN_ARROW || keyCode === 83) {
        s.move(0, 1)
    }
}

function draw() {
    background(220)
    frameRate(30)

    if (!connected) {
        console.log("Failed to connect to server");
        return
    }

    if (food.pos) {
        if (s.intersect(food.pos.x, food.pos.y)) {
            s.grow(food.value)
            socket.emit("food_eaten")
        }

        food.show()
    }

    s.update()
    s.show()

    for (const enemy of enemies) {
        enemy.show()
    }

    socket.emit("move", s)
}