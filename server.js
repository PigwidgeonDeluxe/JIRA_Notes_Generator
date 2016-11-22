var express = require('express');
var app = express();
var https = require('https');
var fs = require('fs');
var bodyParser = require('body-parser');
var ejs = require('ejs');
//set view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));


//send CSS for global html formatting
app.get('/globalstyle.css', function(req, res) {
    //send homepage
    res.sendFile(__dirname + "/globalstyle.css");
})

//send CSS for global html formatting
app.get('/jquery-3.1.1.min.js', function(req, res) {
    //send homepage
    res.sendFile(__dirname + "/jquery-3.1.1.min.js");
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
app.post('/response', function(req, res, next) {

    //get information from user submission
    response = {
        username: req.body.user_query,
        password: req.body.pw_query,
        project_key: req.body.pk_query,
        date_range: req.body.daterange_query,
        is_requested: req.body.requested_query
    };

    //specify host/path/user + jql for JIRA API
    var options = {
        host: 'ondhdp.atlassian.net',
        path: "/rest/api/2/search?jql=project=" + response["project_key"],
        auth: response["username"] + ":" + response["password"]
    };

    //if the user wants to restrict the status to requested only
    if (response["is_requested"]) {
        options["path"] += "%20AND%20status=requested";
    }

    //if the user defines a date range
    if (response["date_range"] != ""){
        options["path"] += "%20AND%20updated>=" + response["date_range"];
    }


    //callback function -  executed during https.get
    callback = function(response) {
        var body = '';
        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function(chunk) {
            body += chunk;
        })

        //the whole response has been recieved, write the response to the logs if enabled
        console.log("Response recieved, connection successful.");

        response.on('end', function() {
            console.log("Processing recieved body.");
            //try parsing the response; catch any errors
            try {
                parsedbody = JSON.parse(body)
            } catch (err) {
                //if there is an error, print error to console and user and stop execution
                var errormessage = "JSON.parse error: " + err
                console.log(errormessage);
                res.send(errormessage + "Check that the user information or URL is valid.");
                return;
            }
            //process the parsed json into a properly formatted json for Tabulator
            var formattedjson = jsonformat(parsedbody)
            console.log("Body processed. Sending data.");
            //send the JSON along with the table ejs
            res.render('index.ejs', {
                jsondata: formattedjson
            });
            console.log("Data sent successfully.")
        })
    }

    //perform GET request catch any errors and print them
    https.get(options, callback).on('error', (err) => {
            console.log(err);
            res.send(err);
        });;


})

//function that takes the JIRA JSON, then takes and formats the data for the table
function jsonformat(inputjson) {
    //create new list for final json output
    var outputjson = [];
    //loop for all issues
    for (i = 0; i < inputjson["issues"].length; i++) {
        //create a new array for current i
        outputjson.push({});
        //add id to current array
        outputjson[i]["id"] = i;
        //add change id to current array
        outputjson[i]["ch_id"] = inputjson["issues"][i]["key"];
        //add rfc_name to current array
        outputjson[i]["rfc_name"] = inputjson["issues"][i]["fields"]["summary"];
        //add description fields to current array
        outputjson[i]["description"] = "";
        for (x = 0; x <= 8; x++) {
            //if the field isn't empty
            if (inputjson["issues"][i]["fields"]["customfield_1040" + x] != null) {
                //add the appropriate decription name for each description entry. ie 10402 us Business Impact
                if (x == 0) {
                    var desc_name = " Business Objective and Rationale: "
                } else if (x == 1) {
                    var desc_name = " Business Requirements: "
                } else if (x == 2) {
                    var desc_name = " Business Impact: "
                } else if (x == 3) {
                    var desc_name = " End User Impact: "
                } else if (x == 4) {
                    var desc_name = " Business/User Impact If Change Is Not Done: "
                } else if (x == 5) {
                    var desc_name = " Risk Assessment: "
                } else if (x == 6) {
                    var desc_name = " Solution: "
                } else if (x == 8) {
                    var desc_name = " Benefits: "
                }
                //add the formatted decription to the array
                outputjson[i]["description"] += desc_name + inputjson["issues"][i]["fields"]["customfield_1040" + x] + "\n" + "\n";
            }
        }
        //add the description as the description if it is not empty
        if (inputjson["issues"][i]["fields"]["description"] != null) {
            //add the formatted decription to the array
            outputjson[i]["description"] += " Description: " + inputjson["issues"][i]["fields"]["description"] + "\n" + "\n";
        }
        //add state to current array
        outputjson[i]["state"] = inputjson["issues"][i]["fields"]["status"]["name"];
        //add priority to current array
        outputjson[i]["priority"] = inputjson["issues"][i]["fields"]["priority"]["name"];
        //add reporter to current array
        if (inputjson["issues"][i]["fields"]["duedate"] != null) {
            outputjson[i]["impdate"] = inputjson["issues"][i]["fields"]["duedate"];
        } else {
            outputjson[i]["impdate"] = "N/A";
        }
        //add assignee to current array if an assignee exists
        if (inputjson["issues"][i]["fields"]["assignee"] != null) {
            outputjson[i]["assignee"] = inputjson["issues"][i]["fields"]["assignee"]["displayName"];
        } else {
            outputjson[i]["assignee"] = "N/A";
        }

    }
    return outputjson;
}


//start server at port 8081
var server = app.listen(8081, function() {

    var host = server.address().address
    var port = server.address().port
        //print to console server address and port
    console.log("Server listening at http://%s:%s", host, port);

})