/* *********************************************
 * Name: Tulsa Web Dev's Talk Management System*
 * By: Blixa Morgan <blixa@projectmakeit.com>  *
 * Date: 10/31/13 13:46                        *
 * Repo: github.com/blister75/TWDTalks         *
 * *********************************************/

/* *********************************************
 * NOTICE: This does not work yet.  Everything *
 * listed is purely mockup.  Any issues added  *
 * will be treated as feature requests and     *
 * handled as such.  Current TODO list follows *
 *                                             *
 * //TODO: Add database backend.               *
 * //TODO: Add login to vaidate members        *
 * *********************************************/

var express = require('express');
var app = express()

//TODO: replace with database information
var data = {talks:
            [
                {
                    title: "How to save the world",
                    speaker: "Adam Savage",
                    description: "Learn how saving the world can be easy and fun!",
                    id: 1234
                }
            ]
           }
app.use(
    express.static(__dirname + '/')
)
app.use(
    express.bodyParser()
)
app.post('/newtalk', function(req,res){
    //TODO: Save talk to database
    console.log(req.body)
    res.send('Talk has been added')
})
app.post('/vote', function(req,res){
    //TODO: Save vote to database
    console.log(req.body.id)
    res.send('accepted')
})
app.get('/gettalks', function(req,res){
    //TODO: Return a list of talks from the database
    console.log(JSON.stringify(data))
    res.send(JSON.stringify(data));
})
app.listen(8000);
