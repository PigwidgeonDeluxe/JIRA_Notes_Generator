var express = require('express');
var app = express();
var https = require('https');
var fs = require('fs');
var bodyParser = require('body-parser');
var ejs = require('ejs');
//set view engine to ejs
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));
app.use(bodyParser.json());

//send CSS for global html formatting
app.get('/globalstyle.css', function(req, res) {
    //send homepage
    res.sendFile(__dirname + "/globalstyle.css");
})

//send CSS for global html formatting
app.get('/jquery-ui.min.css', function(req, res) {
    //send homepage
    res.sendFile(__dirname + "/jquery-ui/jquery-ui.min.css");
})

//send CSS for global html formatting
app.get('/jquery.js', function(req, res) {
    //send homepage
    res.sendFile(__dirname + "/jquery-ui/external/jquery/jquery.js");
})

//send CSS for global html formatting
app.get('/jquery-ui.min.js', function(req, res) {
    //send homepage
    res.sendFile(__dirname + "/jquery-ui/jquery-ui.min.js");
})

//send tabulator css file
app.get('/tabulator.css', function(req, res) {
    //send homepage
    res.sendFile(__dirname + "/tabulator-master/tabulator.css");
})

//send tabulator js file
app.get('/tabulator.js', function(req, res) {
    //send homepage
    res.sendFile(__dirname + "/tabulator-master/tabulator.js");
})

//send ejs js file
app.get('/ejs.js', function(req, res) {
    //send homepage
    res.sendFile(__dirname + "/" + "ejs.js");
})

//send home/landing page to user
app.get('/', function(req, res) {
    //send homepage
    res.sendFile(__dirname + "/" + "homepage.html");
})

//request the page
app.get('/response', function(req, res, next) {
	
    //get information from user submission
    response = {
        username: req.body.user_query,
        password: req.body.pw_query,
        project_key: req.body.pk_query
    }

    //specify host/path/user
    var options = {
        host: 'ondhdp.atlassian.net',
        path: "/rest/api/2/search?jql=project=" + response["project_key"] + "&maxResults=-1",
        auth: response["username"] + ":" + response["password"]
    };

    //res.sendFile(__dirname + "/" + "response.html");

    callback = function(response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function(chunk) {
            str += chunk;
        });

        //the whole response has been recieved, write the response to the logs if enabled
            console.log("Response recieved, connection successful");
            response.on('end', function() {
                //convert the recieved json string into JSON then push the recieved body to the user
                res.json(JSON.parse(str));
            });
    }   
    //perform GET request
    //https.get(options, callback);
    res.render('index.ejs', { jsondata: "Hello world!" });


});

//start server at port 8081
var server = app.listen(8081, function() {

    var host = server.address().address
    var port = server.address().port
        //print to console server address and port
    console.log("Server listening at http://%s:%s", host, port);

})