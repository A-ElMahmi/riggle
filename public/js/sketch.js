let socket

let s
let food

let enemy

function setup() {
    createCanvas(GRID_SIZE * GRID_WIDTH, GRID_SIZE * GRID_HEIGHT)
    socket = io.connect("http://localhost:3000")

    socket.on("move", data => {
        enemy.pos = data.pos
        enemy.body = data.body
    })


    s = new Snake()
    food = new Food()

    enemy = new Snake(true)
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

    if (s.intersect(food.pos.x, food.pos.y)) {
        s.grow(food.value)
        food = new Food()
    }

    food.show()

    s.update()

    if (s.isDead()) {
        s = new Snake()
    }
    
    s.show()
    enemy.show()

    socket.emit("move", s)
}









