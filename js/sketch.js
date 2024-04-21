let s
let food

function setup() {
    createCanvas(GRID_SIZE * GRID_WIDTH, GRID_SIZE * GRID_HEIGHT)

    s = new Snake()
    food = new Food()
}

function keyPressed() {
    if (keyCode === LEFT_ARROW) {
        s.move(-1, 0)
    } else if (keyCode === RIGHT_ARROW) {
        s.move(1, 0)
    } else if (keyCode === UP_ARROW) {
        s.move(0, -1)
    } else if (keyCode === DOWN_ARROW) {
        s.move(0, 1)
    }
}

function draw() {
    background(220)
    frameRate(30)

    if (s.intersect(food.pos.x, food.pos.y)) {
        s.grow()
        food = new Food()
    }

    food.show()

    s.update()
    s.show()
}