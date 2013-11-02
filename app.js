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
 * *********************************************/

var express = require('express');
var app = express()
var verify = require('browserid-verify')();
var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient,
    ObjectID = mongodb.ObjectID

var dbURL = process.env.DBURL
var dbUser = process.env.DBUSER
var dbPass = process.env.DBPASS

var talks = null;

MongoClient.connect(dbURL, function(err, db) {
    if(err) throw err;
    
    talks = db.collection('talks');
    
});

//TODO: replace with database information
app.use(express.logger())
   .use(express.static(__dirname+'/client'))
   .use(express.bodyParser())
   .use(express.cookieParser())
   .use(express.session({
     secret: "mozillapersona"
   }));
app.get('/',function(req,res){
    if(req.session && req.session.email){
        res.sendfile('client/views/home.html')
    }else{
        res.sendfile('client/views/index.html')
    }
});
app.get('/addTalk',function(req,res){
    if(req.session && req.session.email){
        res.sendfile('client/views/addTalk.html')
    }else{
        res.sendfile('client/views/index.html')
    }
});
app.get('/voteTalk',function(req,res){
    if(req.session && req.session.email){
        res.sendfile('client/views/voteTalk.html')
    }else{
        res.sendfile('client/views/index.html')
    }
});
app.post('/persona/login',function(req, resp){
    console.info('verifying with persona');

    var assertion = req.body.assertion;

    verify(assertion, 'localhost:8000', function(err, email, data) {
      if (err) {
        // return JSON with a 500 saying something went wrong
        console.warn('request to verifier failed : ' + err);
        return resp.send(500, { status : 'failure', reason : '' + err });
      }

      // got a result, check if it was okay or not
      if ( email ) {
        console.info('browserid auth successful, setting req.session.email');
        req.session.email = email;
        resp.send(200, data);
      }else{

      // request worked, but verfication didn't, return JSON
      console.error(data.reason);
      console.log(email);
      resp.send(403, data);
      }
    });
})
app.post('/persona/logout',function(req,res){
    req.session.destroy();
    res.send('done')
});
app.post('/newtalk', function(req,res){
    //TODO: Save talk to database
    if(req.session && req.session.email){
      console.log(req.body)
      res.send('Talk has been added')
      addTalk(req.body)
    }else{
        res.send(403)
    }

})
app.post('/vote', function(req,res){
    //TODO: Save vote to database
    if(req.session && req.session.email){
        console.log(req.body.id)
        res.send('accepted')
        addVoteFor(req.body.id)
    }else{
        res.send(403)
    }

})
app.get('/gettalks', function(req,res){
    if(req.session && req.session.email){
        console.log(req.session)
        talks.find().toArray(function(err,results){
            //TODO: Return a list of talks from the database
            var data = {talks:results}
            console.log(JSON.stringify(data))
            res.send(JSON.stringify(data));
        });
    }else{
        res.send(403)
    }
})
app.listen(8000);


function addVoteFor(id){
  talks.findOne({_id: new ObjectID(id)}, function(err, talk){
    talk.votes++
    talks.update({_id: new ObjectID(id)}, talk, {}, console.log)
  });
}

function addTalk(talk){
  talk.votes = 0
  talks.insert(talk, {}, console.log);
}
