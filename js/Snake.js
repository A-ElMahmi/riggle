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
    }

    isDead() {
        if (this.pos.x < 0 || this.pos.x >= GRID_WIDTH || this.pos.y < 0 || this.pos.y >= GRID_HEIGHT) {
            return true
        }

        for (let i = 0; i < this.body.length; i++) {
            if (this.intersect(this.body[i].x, this.body[i].y)) {
                return true
            }
        }

        return false
    }
    
    grow() {
        this.body.unshift(createVector(this.pos))
    }

    move(dirX, dirY) {
        this.vel.x = dirX
        this.vel.y = dirY
    }

    intersect(x, y) {
        return this.pos.x === x && this.pos.y === y
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