class Snake {
    constructor(x, y, size, colourInt, enemy = false) {
        this.pos = createVector(x, y)
        this.vel = createVector(...random([[0, 1], [1, 0], [0, -1], [-1, 0]]))
        this.body = [
            createVector(this.pos.x - this.vel.x, this.pos.y - this.vel.y), 
            createVector(this.pos.x - this.vel.x*2, this.pos.y - this.vel.y*2)
        ]
        this.speed = 1
        this.toGrow = 0

        this.size = size
        this.colourInt = colourInt
        this.enemy = enemy
        this.alive = true
        this.lastRotation = "north"

        const colours = [color(101, 171, 255), color(55, 234, 116), color(242, 152, 46), color(228, 120, 255)]
        this.colour = colours[this.colourInt]

        this.carSound = new Audio("assets/car-sound.mp3")
        this.carSound.loop = true
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


    died() {
        this.alive = false
        this.normalSpeed()

        this.pos.sub(this.vel)
        this.vel.set(0, 0)
    }


    grow(size) {
        this.toGrow += size
    }


    boostSpeed() {
        if (this.body.length <= 2) return
        this.speed = 2
        this.carSound.play()
    }


    normalSpeed() {
        this.speed = 1
        this.carSound.pause()
    }


    move(dirX, dirY) {
        // Ignore backwards movement
        if (dirX === this.vel.x ^ dirY === this.vel.y) return
        if (this.pos.x + dirX === this.body[0].x && this.pos.y + dirY === this.body[0].y) return

        this.vel.x = dirX
        this.vel.y = dirY
    }


    intersect(x, y) {
        return this.pos.x === x && this.pos.y === y
    }

    show(snakeSprite) {
        if (!this.body) return

        // Body
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

        // Tail
        const prev = this.body[this.body.length - 2]
        const last = this.body[this.body.length - 1]
        let dir = "north"
        if (prev.x > last.x) {
            dir = "east"
        } else if (prev.x < last.x) {
            dir = "west"
        } else if (prev.y > last.y) {
            dir = "south"
        }

        this.displayRotatedImage(last, snakeSprite, "tail", dir)

        // Head
        if (!this.alive) {
            this.displayRotatedImage(this.pos, snakeSprite, "head", this.lastRotation)
            return
        }

        dir = "north"
        if (this.vel.x === 1) {
            dir = "east"
        } else if (this.vel.x === -1) {
            dir = "west"
        } else if (this.vel.y === 1) {
            dir = "south"
        }
        
        this.lastRotation = dir
        this.displayRotatedImage(this.pos, snakeSprite, "head", dir)
    }


    displayRotatedImage(pos, sprite, bodyType, direction) {
        const spriteCoord = {
            head:       [0, this.colourInt * 30, 30, 30],
            body:       [30, this.colourInt * 30, 30, 30], 
            bodyCorner: [60, this.colourInt * 30, 30, 30],
            tail:       [90, this.colourInt * 30, 30, 30]
        }

        push()
        imageMode(CENTER)
        translate(pos.x * this.size + (this.size/2) - displacement.x, pos.y * this.size + (this.size/2) - displacement.y)
        

        if (direction === "north") {
            rotate(0)
        } else if (direction === "south") {
            rotate(PI)
        } else if (direction === "east") {
            rotate(PI/2)
        } else if (direction === "west") {
            rotate(-PI/2)
        }

        if (this.speed === 2) {
            drawingContext.shadowBlur = 40
            drawingContext.shadowColor = this.colour
        }

        image(sprite, 0, 0, this.size, this.size, ...spriteCoord[bodyType])
        pop()
    }


    calculateBodyCornerRotation(bodyPos, aPos, bPos) {
        if (aPos.x === bodyPos.x && aPos.y < bodyPos.y && bPos.x < bodyPos.x && bPos.y === bodyPos.y) {
            return "north"
        } else if (aPos.x === bodyPos.x && aPos.y < bodyPos.y && bPos.x > bodyPos.x && bPos.y === bodyPos.y) {
            return "east"
        } else if (aPos.x > bodyPos.x && aPos.y === bodyPos.y && bPos.x === bodyPos.x && bPos.y > bodyPos.y) {
            return "south"
        } else if (aPos.x < bodyPos.x && aPos.y === bodyPos.y && bPos.x === bodyPos.x && bPos.y > bodyPos.y) {
            return "west"
        }

        return null
    }
}