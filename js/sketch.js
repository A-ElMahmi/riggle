let s

function setup() {
    createCanvas(960, 540)

    s = new Snake()
    s.hi()
}

function draw() {
    background(220)

    s.show()

    // fill(0, 0, 255)
    // rect(30, 30, 20, 20)

    textSize(80)
    // text("Alhamdolilah", 200, 250)
}

// function keyPressed() {
//     if (keyCode === LEFT_ARROW)
// }