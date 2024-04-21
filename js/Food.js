class Food {
    constructor() {
        this.pos = createVector(floor(random(GRID_WIDTH)), floor(random(GRID_HEIGHT)))
    }

    show() {
        fill(254, 0, 0)
        ellipse(this.pos.x * GRID_SIZE + (GRID_SIZE/1), this.pos.y * GRID_SIZE + (GRID_SIZE/2), GRID_SIZE, GRID_SIZE)
    }
}