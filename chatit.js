/*
    Author: Jessmer John Palanca
    Section: CSC337 Web Programming SPRING2019, Homework 8
    Filename: chatit.js
    Description: The json file for the chatit.html
*/

'use strict';

(function() {

    window.onload = function(){
        loadChat();
        refresh();
        document.getElementById("submit").onclick = submit;
    };

    /** This function refreshes the comments by fetching the data every 5 seconds.
    */
    function refresh(){
        setInterval(loadChat, 5000);
    }

    /** This function loads all the comments by fetching the file contents using
      * the web service. These data will be posted into the chat box div.
    */
    function loadChat() {
        let url = "http://localhost:3000";
        // clears the success message
        document.getElementById("success").innerHTML = "";
        let chatbox = document.getElementById("chatbox");
        // clears the chat box contents first before loading the newly fetched data
        chatbox.innerHTML = "";
        fetch(url)
            .then(checkStatus)
            .then(function(responseText){
                // parsing the string into JSON format (object)
                let json = JSON.parse(responseText);
                for(let i = 0; i < json.messages.length; i++){
                    // creating a new div element to store the name and the comment data
                    let newDiv = document.createElement("div");
                    newDiv.id = "chatcomment";
                    // creating h4 element for the name
                    let name = document.createElement("h4");
                    // adding the name into the h4 element
                    name.innerHTML = (json.messages[i].name).toUpperCase() + ":";
                    // adding the h4 element into the div
                    newDiv.appendChild(name);
                    // creating a new p element for the comment
                    let comment = document.createElement("p");
                    // adding the comment into the p element
                    let text = document.createTextNode(json.messages[i].comment);
                    comment.appendChild(text);
                    // adding the p element into the new div
                    newDiv.appendChild(comment);
                    // adding the div into the chatbox div
                    chatbox.appendChild(newDiv);
                }
            })
            // catch function for possible error
            .catch(function(error){
                document.getElementById("success").innerHTML = error;
            });
    }

    /** This function gets the data that the user submitted. This data will be
      * converted into an JSON format and then sent it into the chatit_service.
    */
    function submit(){
        // getting the submitted input value
        let name = document.getElementById("name").value;
        let comment =document.getElementById("comment").value;
        // converting the data as an object
        const message = {name: name, comment: comment};
        // sending the parameters to the service
        const fetchOptions = {
            method : 'POST',
            headers : {
    			'Accept': 'application/json',
    			'Content-Type' : 'application/json'
    		},
    		body : JSON.stringify(message)
        };

    	let url = "http://localhost:3000";
        // sending the data
    	fetch(url, fetchOptions)
    		.then(checkStatus)
    		.then(function(responseText) {
                // displays a success message right next to the submit button
    			document.getElementById("success").innerHTML = responseText;
    		})
            // catch function for possible error
    		.catch(function(error) {
    			document.getElementById("success").innerHTML = error;
    		});
        // clearing the input bar and text area after the data has been sent
        document.getElementById("name").value="";
        document.getElementById("comment").value="";
    }

    /** a function that checks and catches errors when the file is being fetched.
      * if an error is detected, it returns an error message, Otherwise, returns the
      * data that was requested.
    */
    function checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response.text();
        } else if (response.status == 400) {
        	return Promise.reject(new Error("FAILED: The file was not saved!"));
        } else {
            return Promise.reject(new Error(response.status+": "+response.statusText));
        }
    }

})();
