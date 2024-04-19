class Snake {
    constructor() {
        this.x = 3
        this.y = 2
        this.size = 40

        this.velX = 1
        this.velY = 0
    }

    hi() {
        console.log("hi");
    }

    show() {
        noStroke()
        fill(255, 255, 0)
        rect(this.x * this.size, this.y * this.size, this.size, this.size)

        // console.log(this.w);

        // fill(0, 0, 255)
        // rect(30, 30, 20, 20)

        line(20, 20, 40, 40)
    }
}