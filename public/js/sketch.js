let socket
let connected = false

let s

let food = []
let enemies = []

let snakeSpriteSheet

function preload() {
    snakeSpriteSheet = loadImage("assets/snake-spritesheet.png")
}

function setup() {
    createCanvas(960, 540)

    socket = io.connect("http://localhost:3000")
    let id

    socket.on("world_info", data => {
        id = data.id
        GRID_SIZE = data.gridSize
        GRID_WIDTH = data.gridWidth
        GRID_HEIGHT = data.gridHeight

        s = new Snake(data.x, data.y, GRID_SIZE)

        for (let i = 0; i < data.foodCount; i++) {
            food.push(new Food(GRID_SIZE))
        }
        connected = true
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

    socket.on("food_location", foodLocation => {
        for (const [i, foodItem] of Object.entries(foodLocation)) {
            food[i].pos = createVector(foodItem.x, foodItem.y)
            food[i].value = foodItem.value
        }
    })

    socket.on("grow", value => {
        s.grow(value.value)
    })
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

    if (keyCode === 32) {
        s.boostSpeed()
    }
}

function keyReleased() {
    if (keyCode === 32) {
        s.normalSpeed()
    }
}


function draw() {
    background(220)
    frameRate(30)

    if (!connected) {
        console.log("Failed to connect to server");
        return
    }

    for (const foodItem of food) {
        foodItem.show()
    }

    s.update()
    s.show(snakeSpriteSheet)

    for (const enemy of enemies) {
        enemy.show()
    }

    socket.emit("move", s)
}