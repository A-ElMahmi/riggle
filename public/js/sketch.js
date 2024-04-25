let socket
const GRID_SIZE = 30
const GRID_WIDTH = 70

const MENU_MODE = 0
const GAME_MODE = 1
let mode = MENU_MODE

let menu, game
let displacement

let ip = "localhost"
// if (confirm("Are you the hacker?") === false) {
//    ip = "10.156.15.105" 
//    ip = "192.168.0.129" 
// }

function setup() {
    createCanvas(960, 540)

    socket = io.connect("http://" + ip + ":3000")

    menu = new Menu()
    game = new Game()

    displacement = createVector((GRID_WIDTH * GRID_SIZE) / 2, (GRID_WIDTH * GRID_SIZE) / 2)

    game.setupOtherPlayers()
    menu.setup(true)
    game.setup()

}

function keyPressed() {
    if (mode == GAME_MODE) {
        game.keyPressed()
    }
}

function keyReleased() {
    if (mode === GAME_MODE) {
        game.keyReleased()
    } else if (mode === MENU_MODE) {
        menu.keyReleased()
    }
}

function mousePressed() {
    if (mode === MENU_MODE) {
        menu.mousePressed()
    }
}

function mouseReleased() {
    if (mode === MENU_MODE) {
        menu.mouseReleased()
    }
}

function draw() {
    background(220)
    frameRate(30)

    translate(width/2, height/2)

    if (mode === MENU_MODE) {
        if (menu.startGame) {
            menu.startGame = false
            changeMode(GAME_MODE)
        }

        game.drawOtherPlayers()
        menu.draw()

    } else if (mode === GAME_MODE) {
        if (game.snakeDied && game.deathTimer <= 0) {
            changeMode(MENU_MODE)
        }
        game.draw()
    }
}

function changeMode(newMode) {
    mode = newMode

    if (mode === MENU_MODE) {
        menu.setup()
    } else if (mode === GAME_MODE) {
        // game.setup()
        game.respawn()
    }
}