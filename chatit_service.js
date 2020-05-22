/*
    Author: Jessmer John Palanca
    Section: CSC337 Web Programming SPRING2019, Homework 8
    Filename: chatit_service.js
    Description: The web service for the chatit.js
*/

const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const fs = require("fs");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
               "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(express.static('public'));

console.log("Web service started!");
// accessing the parameters that was received
app.post('/', jsonParser, function(req, res){
    // the text representation that will be written into the file
    let msg = req.body.name + ":::" + req.body.comment + "\n";
    // appending the text into the existing file content
    fs.appendFile('messages.txt', msg, function(err){
        if(err){
            res.status(400);
            console.log("The file was not saved!");
            //return console.log(err);
        }
        // returns a message that the file was successfully saved
        res.send("SUCCESS: The file was saved!");
        console.log("The file was saved!");
    })
});

// fetching the file contents
app.get('/', function(req, res){
    // reading the text file
    let file = fs.readFileSync("messages.txt", 'utf8');
    // a list of each line of the text file
    let lines = file.split("\n");
    // removing any empty elements in the list
    lines = lines.filter(Boolean);
    // initializing an object foe the messages
    let messages = {};
    // iniializing a list that will contain a list of the user's name and user's
    // comments as the value of the fieldname "messages"
    let array = [];
    for(let i = 0; i < lines.length; i++){
        // creating a new array that stores the user's name and user's comment
        let newObj = {};
        // index of the first colon (:)
        let firstColonIndex = lines[i].indexOf(":");
        // index of the last colon (:)
        let lastColonIndex = lines[i].lastIndexOf(":") + 1;
        // length of the name
        let nameLength = firstColonIndex;
        // length of the comment
        let commentLength = lines[i].length - lastColonIndex
        // parsing the user's name
        let name = lines[i].substr(0, nameLength);
        // parsing the user's comment
        let comment = lines[i].substr(lastColonIndex, commentLength);
        // setting the object's values
        newObj["name"] = name;
        newObj["comment"] = comment;
        array.push(newObj);
     }
    messages["messages"] = array;
    // sending the data in a stringified JSON format
    res.send(JSON.stringify(messages));
});

app.listen(3000);
