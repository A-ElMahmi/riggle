class Snake {
    constructor() {
        this.pos = createVector(floor(GRID_WIDTH / 3), floor(GRID_HEIGHT / 2))
        this.vel = createVector(1, 0)
        
        this.body = [createVector(this.pos.x - 1, this.pos.y), createVector(this.pos.x-2, this.pos.y)]
    }
    
    update() {
        if (frameCount % 5 === 0) {
            for (let i = this.body.length - 1; i > 0; i--) {
                this.body[i].set(this.body[i-1])
            }

            this.body[0].set(this.pos)
            this.pos.add(this.vel)

        }
        
        this.pos.x = constrain(this.pos.x, 0, GRID_WIDTH-1)
        this.pos.y = constrain(this.pos.y, 0, GRID_HEIGHT-1)
    }
    
    grow() {
        this.body.unshift(createVector(this.pos))
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
        for (let i = 0; i < this.body.length; i++) {
            rect(this.body[i].x * GRID_SIZE, this.body[i].y * GRID_SIZE, GRID_SIZE, GRID_SIZE)
        }
    }
}