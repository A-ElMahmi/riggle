class Menu {
    setup(firstScreen = false) {
        this.startGame = false
        this.titleImg = null
        this.btn = null
        this.btnPos = createVector(0, 30 + 75)
        this.btnScale = 1

        this.cameraMoving = false
        this.cameraStart, this.cameraEnd, this.displacementVel
        this.firstScreen = firstScreen

        this.titleImg = loadImage("assets/title.png")
        this.btn = loadImage("assets/start-btn.png")

        this.clickSound = new Audio("assets/click.mp3")

        this.findCameraLoc()
    }

    mousePressed() {
        const mousePos = createVector(mouseX - (width/2), mouseY - (height/2))

        if (this.btnIntersect(mousePos.x, mousePos.y)) {
            this.btnScale = 0.9
        }
    }

    mouseReleased() {
        const mousePos = createVector(mouseX - (width/2), mouseY - (height/2))

        if (this.btnIntersect(mousePos.x, mousePos.y)) {
            this.btnScale = 1
            this.clickSound.play()
            this.startGame = true
        }
    }

    keyReleased() {
        if (keyCode === 32) {
            this.startGame = true
        }
    }

    draw() {
        // if (this.firstScreen) {
            this.moveCamera()
        // }

        fill(0, 30)
        rect(- width/2, - height/2, width, height)

        image(this.titleImg, - this.titleImg.width/2, - height/2 + 70 + (sin(frameCount/10) * 6))

        push()
        imageMode(CENTER)
        image(this.btn, this.btnPos.x, this.btnPos.y, this.btn.width * this.btnScale, this.btn.height * this.btnScale)
        pop()
    }

    findCameraLoc() {
        const buffer = 15
        let cameraStart = createVector(floor(random(buffer, GRID_WIDTH - buffer)), floor(random(buffer, GRID_WIDTH - buffer)))
        let cameraEnd
        let allDirections = []

        allDirections.push(createVector(cameraStart.x + floor(random(10, 20)), cameraStart.y))
        allDirections.push(createVector(cameraStart.x - floor(random(10, 20)), cameraStart.y))
        allDirections.push(createVector(cameraStart.x, cameraStart.y + floor(random(10, 20))))
        allDirections.push(createVector(cameraStart.x, cameraStart.y - floor(random(10, 20))))

        do {
            cameraEnd = random(allDirections)
            allDirections = allDirections.filter(e => e !== cameraEnd)
        } while (cameraEnd.x < 0 || cameraEnd.x > GRID_WIDTH || cameraEnd.y < 0 || cameraEnd.y > GRID_WIDTH)

        cameraStart.mult(GRID_SIZE)
        cameraEnd.mult(GRID_SIZE)
        displacement.set(cameraStart)

        return [ cameraStart, cameraEnd ]
    }

    moveCamera() {
        if (!this.cameraMoving) {
            [ this.cameraStart, this.cameraEnd ] = this.findCameraLoc()
            this.displacementVel = this.cameraEnd.copy().sub(this.cameraStart).normalize().mult(1)
            this.cameraMoving = true
        }

        displacement.add(this.displacementVel)

        if (this.cameraMoving && displacement.dist(this.cameraEnd) < 5) {
            this.cameraMoving = false
        }
    }

    btnIntersect(x, y) {
        return (x > this.btnPos.x - (this.btn.width/2) && x < this.btnPos.x + (this.btn.width/2)
        && y > this.btnPos.y - (this.btn.height/2) && y < this.btnPos.y + (this.btn.height/2))
    }
}









































































