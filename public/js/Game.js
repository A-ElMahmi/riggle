class Game {
    setup() {
        this.deathSound = new Audio("assets/death-sound.mp3")
        this.foodSound = new Audio("assets/food-chime.mp3")
        this.barkingSound = new Audio("assets/barking.mp3")
        this.barkingSound.loop = true

        this.bgMusic = new Audio("assets/bg-music.mp3")
        this.bgMusic.loop = true

        this.righteousFont = loadFont("assets/righteous-regular.ttf")

        socket.on("player_info", snakeInfo => {
            this.s = new Snake(snakeInfo.pos.x, snakeInfo.pos.y, GRID_SIZE, snakeInfo.colourInt)
            displacement.set(this.s.pos.x * GRID_SIZE, this.s.pos.y * GRID_SIZE)

            this.started = true
        })

        socket.on("dead", () => {
            this.snakeDied = true
            this.shakeTimer = 20
            this.displacementSpeed = 0.3

            this.s.died()
            this.barkingSound.pause()

            this.bgMusic.pause()
            this.deathSound.play()
        })

        socket.on("grow", value => {
            this.s.grow(value.value)

            this.foodSound.play()
        })
    }

    respawn() {
        this.started = false
        this.snakeDied = false

        this.displacementSpeed = 1
        this.zoom = 1
        this.shake = createVector(0, 0)
        this.shakeTimer = 0
        this.deathTimer = 25

        this.bgMusic.play()

        socket.emit("ready_to_play")
    }

    setupOtherPlayers() {
        this.food = []
        this.enemies = []
        this.blocks = []

        this.snakeSpriteSheet = loadImage("assets/snake-spritesheet2.png")
        this.bgImage = loadImage("assets/bg.jpg")

        let id
        socket.on("world_info", data => {
            id = data.id

            for (let i = 0; i < data.foodCount; i++) {
                this.food.push(new Food(GRID_SIZE))
            }

            for (const block of data.blocks) {
                this.blocks.push(new Block(block.x, block.y))
            }
        })

        socket.on("move", snakes => {
            delete snakes[id]

            this.enemies = []
            for (const [_, snakeInfo] of Object.entries(snakes)) {
                let enemy = new Snake(snakeInfo.pos.x, snakeInfo.pos.y, GRID_SIZE, snakeInfo.colourInt, true) 
                enemy.body = snakeInfo.body
                this.enemies.push(enemy)
            }
        })

        socket.on("food_location", foodLocation => {
            for (const [i, foodItem] of Object.entries(foodLocation)) {
                this.food[i].pos = createVector(foodItem.x, foodItem.y)
                this.food[i].value = foodItem.value
            }
        })
    }

    keyPressed() {
        if (this.snakeDied) return

        if (keyCode === LEFT_ARROW || keyCode === 65) {
            this.s.move(-1, 0)
        } 
        if (keyCode === RIGHT_ARROW || keyCode === 68) {
            this.s.move(1, 0)
        } 
        if (keyCode === UP_ARROW || keyCode === 87) {
            this.s.move(0, -1)
        } 
        if (keyCode === DOWN_ARROW || keyCode === 83) {
            this.s.move(0, 1)
        }

        if (keyCode === 32) {
            this.s.boostSpeed()
        }
    }

    keyReleased() {
        if (this.snakeDied) return

        if (keyCode === 32) {
            this.s.normalSpeed()
        }
    }

    draw() {
        if (!this.started) {
            this.drawOtherPlayers()
            return
        }

        // console.log("ShakeTimer", this.shakeTimer);
        // console.log("Death Timer", this.deathTimer);
        // console.log({displacement});
        // console.log("Player", this.s.pos);
        // console.log("Displacement Speed", this.displacementSpeed);

        displacement.set(
            lerp(displacement.x, this.s.pos.x * GRID_SIZE, 0.05 * this.displacementSpeed), 
            lerp(displacement.y, this.s.pos.y * GRID_SIZE, 0.05 * this.displacementSpeed)
        )
        // console.log({displacement});

        if (this.shakeTimer > 0) {
            this.shake.set(random(-2, 3), random(-2, 3))
            displacement.add(this.shake)
            this.shake.set(0, 0)

            this.shakeTimer--
        }
        
        push()
        this.zoom = - (this.s.body.length) / 500 + 1.1
        this.zoom = constrain(this.zoom, 0.7, 1)
        scale(this.zoom)

        // console.log("Zoom", this.zoom);
        this.drawOtherPlayers()

        if (this.snakeDied) {
            // console.log(this.s.pos.toString());
            // console.log(displacement.toString());
            this.deathTimer--
            this.s.show(this.snakeSpriteSheet)
            return
        }

        this.playBarkingSound()

        this.s.update()
        this.s.show(this.snakeSpriteSheet)

        pop()
        this.displayMinimap()
        
        push()
        textAlign(RIGHT, TOP)
        textFont(this.righteousFont)
        fill(255)
        stroke(0)
        strokeWeight(5)
        textSize(80)
        text(this.s.body.length + this.s.toGrow - 2, width/2 - 20, -height/2)
        pop()


        if (frameCount % 3 === 0) {
            socket.emit("move", this.s)
        }
    }

    drawOtherPlayers() {
        this.displayBg()

        for (const foodItem of this.food) {
            foodItem.show()
        }

        for (const block of this.blocks) {
            block.draw()
        }

        for (const enemy of this.enemies) {
            enemy.show(this.snakeSpriteSheet)
        }
    }

    playBarkingSound() {
        let closeToSomeone = false
        for (const enemy of this.enemies) {
            if (this.s.pos.dist(enemy.pos) < 5) {
                closeToSomeone = true
                this.barkingSound.play()
            }
        }

        if (!closeToSomeone) {
            this.barkingSound.pause()
        }
    }

    displayBg() {
        const bgWidth = 1050
        const gameWidth = bgWidth * 2

        for (let x = -1; x < 3; x++) {
            for (let y = -1; y < 3; y++) {
                image(this.bgImage, 0 - displacement.x + (x * bgWidth), 0 - displacement.y + (y * bgWidth))
            }
        }

        push()
        stroke(0, 120)
        strokeWeight(bgWidth)
        noFill()
        rect(-(bgWidth/2) - displacement.x -15, -(bgWidth/2) - displacement.y -15, 3 * bgWidth +30, 3 * bgWidth +30)

        stroke(200, 20, 45)
        strokeWeight(15)
        strokeJoin(ROUND)
        noFill()
        drawingContext.shadowBlur = 30
        drawingContext.shadowColor = color(200, 10, 100)
        rect(-15 - displacement.x, -15 - displacement.y, gameWidth + 30, gameWidth + 30)
        pop()
    }

    displayMinimap() {
        const mapX = - width/2 + 10
        const mapY = - height/2 + 10

        stroke(0)
        strokeWeight(2)
        fill(255, 80)
        rect(mapX, mapY, 140, 140)

        noStroke()
        for (const enemy of this.enemies) {
            if (!enemy.colour || !enemy.body) return

            fill(enemy.colour)
            rect(mapX + (enemy.pos.x*2), mapY + (enemy.pos.y*2), 4, 4)

            for (const bodyPart of enemy.body) {
                rect(mapX + (bodyPart.x * 2), mapY + (bodyPart.y * 2), 4, 4)
            }
        }

        fill(this.s.colour)
        for (const bodyPart of this.s.body) {
            rect(mapX + (bodyPart.x * 2), mapY + (bodyPart.y * 2), 4, 4)
        }

        push()
        drawingContext.shadowBlur = 5
        drawingContext.shadowColor = color(0)
        strokeWeight(1)
        rect(mapX + (this.s.pos.x * 2) - 2, mapY + (this.s.pos.y * 2) - 2, 8, 8)
        pop()
    }
}




















