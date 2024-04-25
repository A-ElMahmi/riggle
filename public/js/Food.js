class Food {
    constructor(size) {
        this.pos = null 
        this.value = null 
        this.size = size
    }

    show() {
        if (!this.pos) return

        const colours = [color(33, 176, 169), color(188, 41, 204), color(224, 133, 22)]
        let c = colours[this.value - 1]

        push()
        drawingContext.shadowBlur = 20
        drawingContext.shadowColor = c

        noStroke()
        fill(c)
        circle(this.pos.x * this.size + (this.size/2) - displacement.x, this.pos.y * this.size + (this.size/2) - displacement.y, 15 + (4*this.value))
        pop()
    }
}
















