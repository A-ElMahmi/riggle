class Food {
    constructor(size) {
        this.pos = null 
        this.value = null 
        this.size = size
    }

    show() {
        if (!this.pos) return

        fill(this.value * 85, 0, 0)
        ellipse(this.pos.x * this.size + (this.size/2), this.pos.y * this.size + (this.size/2), this.size, this.size)
    }
}