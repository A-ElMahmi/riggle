class Snake {
    constructor() {
        this.pos = createVector(floor(GRID_WIDTH / 3), floor(GRID_HEIGHT / 2))
        this.vel = createVector(1, 0)
        
        this.tail = createVector(this.pos.x - 1, this.pos.y)
    }
    
    update() {
        if (frameCount % 5 === 0) {
            this.tail.set(this.pos)
            this.pos.add(this.vel)
        }
        
        this.pos.x = constrain(this.pos.x, 0, GRID_WIDTH-1)
        this.pos.y = constrain(this.pos.y, 0, GRID_HEIGHT-1)
    }

    move(dirX, dirY) {
        // Prevent backwards movement
        if (dirX === this.vel.x ^ dirY === this.vel.y) {
            console.log("DIE");
        }

        this.vel.x = dirX
        this.vel.y = dirY
    }

    show() {
        noStroke()
        fill(0, 255, 255)
        rect(this.pos.x * GRID_SIZE, this.pos.y * GRID_SIZE, GRID_SIZE, GRID_SIZE)
        
        fill(0, 205, 255)
        rect(this.tail.x * GRID_SIZE, this.tail.y * GRID_SIZE, GRID_SIZE, GRID_SIZE)
    }
}