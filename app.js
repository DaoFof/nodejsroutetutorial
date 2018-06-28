
const http = require('http');
//http module for creating server
const express = require('express');
// Express is very important module for simplicity of creation of route and more stuff
var app = express();
//Create a express instance
var server = http.createServer(app);
// registering app to server
const bodyParser = require('body-parser');
/*For parsing data receive from apis caller because data original come buffered so we need to parse it.
 body-parser will attach the data receive to the request object of the caller*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/*
Using bodyparser middleware
A middleware is a function that will be executed before the final callback
So in between of the call the middleware will parse the data and then pass it to api callback
*/

//MOCK DATA
/*
WARNING: Originally this mock data of persons array of object
will be comming from data base, for illustration purpose only
we used a simple array
*/
var persons = [
    {
        first_name: 'Mamadou',
        last_name: 'Karamoko',
        id: '0'
    },{
        first_name: 'Lassina',
        last_name: 'Dosso',
        id: '1'
    },{
        first_name: 'Falikou',
        last_name: 'Karamoko',
        id: '2'
    },{
        first_name: 'Rahamata',
        last_name: 'Karamoko',
        id: '3'
    }, {
        first_name: 'Franck',
        last_name: 'Yapo',
        id: '4'
    },{
        first_name: 'Youssouf',
        last_name: 'Kanate',
        id: '5'
    },{
        first_name: 'Daouda',
        last_name: 'Fofana',
        id: '6'
    },
]

//END MOCK DATA


//Create a simple get request
/*
app.get(ROUTEPATH, [MIDDLEWARE] or MIDDLEWARE (OPTIONAL), callback);

Every route configuration is same,
ROUTEPATH: the path to which the route will listen
MIDDLEWARE: CAN be an array of middleware or one function only, and it is optional.
It takes 3 parameters, request, response and next
    Request: Will store all the information about the caller and in addition with the data sent, 
            in case of patch, put, delete request because of the middleware body-parser.
    Response: Have necessary methods and information to reply back to the caller
    next: The next() function should be call in a middleware to tell to the function,
            "We can move now to callback", otherwise it will hang the process
callback: it is a function taking two parameters: request and response the same in the middleware 

*/
app.get('/getall', (request, response)=>{
    /*
        In the following try and catch block, we will be doing or operation.
        In the try block we can be doing asynchronous operation towards database so in case of any error,
        occuring during the process of the try block will be trown to the catch block
        and the error parameter will have the error information
    */
    try {
        response.send({persons});
        /*response.send() is the method used to send back data to the caller,
        in case we need to*/
        //response.status().send()
    } catch (error) {
        response.send(error);
    }
});

/*Sometime we need to pass some data in the url 
Parameter :id will store data pass to it
*/

app.get('/getone/:id', (req, res) => {
    try {
        var id = req.params.id;
        console.log(id);
        var person = persons.filter((obj)=>{
            return obj.id === id
        })
        res.send({person});
    } catch (e) {
        res.send(e);
    }
});

//Posting data
app.post('/postnewperson', (req, res) => {
    try {
        var data = req.body.person;
        //The data sent is in the person object
        console.log(data);
        persons.push(data)
        res.send({persons});
    } catch (e) {
        res.status(400).send(e);
    }
});

//Deleting
app.delete('/deleteperson', (req, res) => {
    try {
        var data = req.body.person;
        var id = data.id;
        console.log(id);
        /*if data was passed in the url parameter with route,
        example: deleteperson:/id , we could have just take it same as example above*/
        var temp = persons, personsRemoved ;
        for (const [index, person] of temp.entries()) {
            if (person.id === id) {
                personsRemoved = persons.slice(index, index + 1);
                break;
            }
        }
        res.status(200).send(personsRemoved);
    } catch (e) {
        res.status(400).send(e);
    }
}); 
//Patch
app.patch('/patchperson', (req, res) => {
    try {
        var data = req.body.person;
        var id = data.id;
        console.log(id);
        var temp = persons;
        for (const [index, person] of temp.entries()) {
            if(person.id === id){
                persons[index] = data;
                break;
            }
        }
        res.send({ persons });
    } catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
});

//Make the server now listen to a port
const port = 3000;
server.listen(port, () => {
    console.log(`Server is up on ${port}`);
});
