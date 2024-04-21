let express = require("express")

let app = express()
let server = app.listen(3000)

app.use(express.static("public"))

console.log("Server is running");

let io = require("socket.io")(server)

io.sockets.on("connection", (socket) => {
    console.log("New connection :)");

    socket.on("move", data => {
        socket.broadcast.emit("move", data)
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected :(");
    })
})

































