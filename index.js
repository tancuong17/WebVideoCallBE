const app = require('express')();
const http = require('http').createServer(app);
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
	apiKey: "",
  	apiSecret: ""
});
const io = require('socket.io')(http, {
  cors: {
    origins: ['http://localhost:3000']
  }
});
app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});
app.post("/sendsms", function(req, res) {
	const from = "84382572663"
	const to = "84382572663"
	const text = 'Xin chào!'
	nexmo.message.sendSms(
		from, to, text, {type: 'unicode'},
		(err, responseData) => {if (responseData) {console.log(responseData)}}
	);
	res.json("Hello");
});

io.on("connection", (socket) => {
	socket.on("login", (data) => {
		socket.join(data)
	})
	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})
	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", data);
	})
	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal);
	})
})

http.listen(3001, () => {
  console.log('listening on *:3001');
});
