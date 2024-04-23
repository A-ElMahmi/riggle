class Snake {
    constructor(x, y, size, enemy = false) {
        this.reset(x, y)

        this.size = size
        this.enemy = enemy
    }

    reset(x, y) {
        this.pos = createVector(x, y)
        this.vel = createVector(...random([[0, 1], [1, 0], [0, -1], [-1, 0]]))
        this.body = [
            createVector(this.pos.x - this.vel.x, this.pos.y - this.vel.y), 
            createVector(this.pos.x - this.vel.x*2, this.pos.y - this.vel.y*2)
        ]
        this.speed = 1
        this.toGrow = 0
    }

    update() {
        if (this.speed === 2 && this.body.length <= 2) {
            this.normalSpeed()
        }

        if (frameCount % (6 / this.speed) === 0) {
            if (this.speed === 2) {
                this.body.pop()
            }

            if (this.toGrow > 0) {
                this.body.push(createVector(this.body[this.body.length-1]))
                this.toGrow--
            }

            for (let i = this.body.length - 1; i > 0; i--) {
                this.body[i].set(this.body[i-1])
            }

            this.body[0].set(this.pos)
            this.pos.add(this.vel)
        }
    }

    grow(size) {
        // console.log(size);
        this.toGrow += size
    }

    boostSpeed() {
        if (this.body.length <= 2) return
        this.speed = 2
    }

    normalSpeed() {
        this.speed = 1
    }

    move(dirX, dirY) {
        // Ignore backwards movement
        if (dirX === this.vel.x ^ dirY === this.vel.y) return

        this.vel.x = dirX
        this.vel.y = dirY
    }

    intersect(x, y) {
        return this.pos.x === x && this.pos.y === y
    }

    show(snakeSprite = null) {
        if (snakeSprite === null) {
            let colour = this.enemy ? 150 : 255

            noStroke()
            fill(0, 255, colour)
            rect(this.pos.x * this.size, this.pos.y * this.size, this.size, this.size)
            
            fill(0, 205, colour)
            for (let i = 0; i < this.body.length; i++) {
                rect(this.body[i].x * this.size, this.body[i].y * this.size, this.size, this.size)
            }

        } else {
            let dir = "north"
            if (this.vel.x === 1) {
                dir = "east"
            } else if (this.vel.x === -1) {
                dir = "west"
            } else if (this.vel.y === 1) {
                dir = "south"
            }
            
            this.displayRotatedImage(this.pos, snakeSprite, "head", dir)

            for (let i = 0; i < this.body.length-1; i++) {
                const prev = i === 0 ? this.pos : this.body[i-1] 
                const curr = this.body[i]
                const next = this.body[i+1]

                let bodyPart, dir

                if (prev.x === next.x) {
                    bodyPart = "body"
                    dir = "north"
                } else if (prev.y === next.y) {
                    bodyPart = "body"
                    dir = "east"
                } else {
                    bodyPart = "bodyCorner"

                    const prevFirst = this.calculateBodyCornerRotation(curr, prev, next)
                    const nextFirst = this.calculateBodyCornerRotation(curr, next, prev)

                    dir = prevFirst === null ? nextFirst : prevFirst
                }
                
                this.displayRotatedImage(this.body[i], snakeSprite, bodyPart, dir)
            }

            const prev = this.body[this.body.length - 2]
            const last = this.body[this.body.length - 1]
            dir = "north"
            if (prev.x > last.x) {
                dir = "east"
            } else if (prev.x < last.x) {
                dir = "west"
            } else if (prev.y > last.y) {
                dir = "south"
            }

            this.displayRotatedImage(last, snakeSprite, "tail", dir)
        }
    }

    
}