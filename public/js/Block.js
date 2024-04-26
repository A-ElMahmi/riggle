class Block {
    constructor(x, y) {
        this.pos = createVector(x, y)
    }

    draw() {
        // const c = color(214, 13, 13)

        push()
        // drawingContext.shadowBlur = 10
        // drawingContext.shadowColor = c
        // noStroke()
        // fill(c)
        stroke(235)
        strokeWeight(2)
        fill(100)
        rect(this.pos.x * GRID_SIZE - displacement.x, this.pos.y * GRID_SIZE - displacement.y, GRID_SIZE, GRID_SIZE)
        pop()
    }
}