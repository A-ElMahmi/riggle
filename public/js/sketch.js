let socket
let connected = false

let s
let food

let enemies = []

function setup() {
    createCanvas(GRID_SIZE * GRID_WIDTH, GRID_SIZE * GRID_HEIGHT)

    socket = io.connect("http://localhost:3000")
    let id

}

function keyPressed() {
    if (keyCode === LEFT_ARROW || keyCode === 65) {
        s.move(-1, 0)
    } else if (keyCode === RIGHT_ARROW || keyCode === 68) {
        s.move(1, 0)
    } else if (keyCode === UP_ARROW || keyCode === 87) {
        s.move(0, -1)
    } else if (keyCode === DOWN_ARROW || keyCode === 83) {
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