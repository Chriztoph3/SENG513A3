var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var people = [];
var history = [];
function getTimeStamp()
{
	var date = new Date();
	var year = date.getFullYear();
	var day = date.getDate();
	var month = date.getMonth();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	var timeStamp = " on " + year + "/" + month + "/" + day + " at " + hours + ":" + minutes + ":" + seconds + " ";
	return timeStamp
}

function getOccupation(id)
{
	var occupations = ["Antiquarian", "Artist", "Athlete", "Author", "Clergy Member", "Criminal", "Doctor",
		"Drifter", "Engineer", "Entertainer", "Farmer", "Hacker", "Journalist", "Lawyer", "Librarian", 
		"Military Officer", "Missionary", "Musician", "Parapsychologist", "Pilot", "Detective", "Police Officer",
		"Private Investigator", "Professor", "Soldier", "Savage", "Zealot"] ;
	var idNumber = id.charCodeAt(id[0]) % occupations.length;
	var occupation = occupations[idNumber];
	return occupation;
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log( getOccupation(socket.id) + ' connected' + getTimeStamp());
  io.emit('chat message', "*" + getOccupation(socket.id) + " enters the room*" );
  people.push(getOccupation(socket.id));
  io.emit('peopleListUpdate', people);
  io.emit('history', history);
    
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', "The " + getOccupation(socket.id) + getTimeStamp() + 'says: "' + msg + '"');
	history.push("The " + getOccupation(socket.id) + getTimeStamp() + 'says: "' + msg + '"');
	if(msg.slice(0,5) === "/nick")
	{
		var nickName = msg;
		io.emit('chat message', "nickname changed to " + nickName);
	}
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
