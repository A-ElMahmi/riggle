class Snake {
    constructor(x, y, size, enemy = false) {
        this.reset(x, y)

        this.size = size
        this.enemy = enemy
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

    grow(size) {
        console.log(size);

        for (let i = 0; i < size; i++) {
            this.body.unshift(createVector(this.pos))
        }
    }

    move(dirX, dirY) {
        this.vel.x = dirX
        this.vel.y = dirY
    }

    intersect(x, y) {
        return this.pos.x === x && this.pos.y === y
    }

    show() {
        let colour = this.enemy ? 150 : 255

        noStroke()
        fill(0, 255, colour)
        rect(this.pos.x * this.size, this.pos.y * this.size, this.size, this.size)
        
        fill(0, 205, colour)
        for (let i = 0; i < this.body.length; i++) {
            rect(this.body[i].x * this.size, this.body[i].y * this.size, this.size, this.size)
        }
    }
}