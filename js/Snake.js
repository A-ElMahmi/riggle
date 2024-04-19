class Snake {
    constructor() {
        this.x = 3
        this.y = 2
        this.pos = createVector(floor(GRID_WIDTH / 3), floor(GRID_HEIGHT / 2))

        this.vel = createVector(1, 0)
        this.velX = 1
        this.velY = 0

        this.tail = createVector(this.pos.x - 1, this.pos.y)
        this.tailX = this.x - 1
        this.tailY = this.y
    }
    
    update() {
        if (frameCount % 5 === 0) {
            this.tailX = this.x
            this.tailY = this.y

            this.x += this.velX
            this.y += this.velY
        }
        
        this.x = constrain(this.x, 0, GRID_WIDTH-1)
        this.y = constrain(this.y, 0, GRID_HEIGHT-1)
    }

    move(dirX, dirY) {
        // Prevent backwards movement
        if (dirX === this.velX ^ dirY === this.velY) {
            console.log("DIE");
        }

        this.velX = dirX
        this.velY = dirY
    }

    show() {
        noStroke()
        fill(0, 255, 255)
        rect(this.x * GRID_SIZE, this.y * GRID_SIZE, GRID_SIZE, GRID_SIZE)
        
        fill(0, 205, 255)
        rect(this.tailX * GRID_SIZE, this.tailY * GRID_SIZE, GRID_SIZE, GRID_SIZE)
    }
}