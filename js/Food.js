class Food {
    constructor() {
        this.pos = createVector(floor(random(GRID_WIDTH)), floor(random(GRID_HEIGHT)))
        this.value = ceil(random(3))
    }

    show() {
        fill(this.value * 85, 0, 0)
        ellipse(this.pos.x * GRID_SIZE + (GRID_SIZE/2), this.pos.y * GRID_SIZE + (GRID_SIZE/2), GRID_SIZE, GRID_SIZE)
    }
}