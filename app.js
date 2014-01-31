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
var audiance = process.env.AUD

var talks = null;

MongoClient.connect(dbURL, function(err, db) {
    if(err) throw err;
    
    talks = db.collection('talks');
    users = db.collection('users');
    
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

    verify(assertion, audiance, function(err, email, data) {
      if (err) {
        // return JSON with a 500 saying something went wrong
        console.warn('request to verifier failed : ' + err);
        return resp.send(500, { status : 'failure', reason : '' + err });
      }

      // got a result, check if it was okay or not
      if ( email ) {
        console.info('browserid auth successful, setting req.session.email');
        req.session.email = email;
        users.find({email:email}).toArray(function(err,results){
          if(results.length<1){
            users.insert({email:email,votes:0},{},console.log)
          }
        })
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
      addTalk(req.session.email,req.body,res)
    }else{
        res.send(401,'Not Authenticated')
    }

})
app.post('/vote', function(req,res){
    //TODO: Save vote to database
    if(req.session && req.session.email){
      addVoteFor(req.session.email,req.body.id,res)
    }else{
        res.send(401,'Not Authenticated')
    }

})
app.get('/gettalks', function(req,res){
    if(req.session && req.session.email){
        console.log(req.session)
        talks.find().toArray(function(err,results){
            var data = {talks:results}
            console.log(JSON.stringify(data))
            res.send(JSON.stringify(data));
        });
    }else{
        res.send(401)
    }
})

app.get('/talk/results', function(req,res){
  if(req.session && req.session.email){
    var results = runMatchingAlgorithem(res)
  }else{
    res.send(401)
  }
})
      
app.listen(process.env.PORT || 8000);


function addVoteFor(email,id,res){
  users.findOne({email:email},function(err,user){
    console.log(err)
    console.log(user)
    if(true){//we no longer limit to 3 votes
      talks.findOne({_id: new ObjectID(id)}, function(err, talk){
        if(talk.votes[user._id]==true){
          res.send(403,'Already Voted')
          return
        }
        talk.votes[user._id]=true
        talks.update({_id: new ObjectID(id)}, talk, {}, console.log)
        res.send(200,'vote accepted')
        user.votes++
        users.update({email:email},user,{},console.log)
      });
    }else{
      res.send(403,'Too Many Votes.')
    }
  })
}

function addTalk(email,talk,res){
  users.findOne({email:email},function(err,user){
    if(true){//you can add as many votes as you want
      talk.votes = {}
      talk.votes[user._id]=true
      talk.user = user._id
      user.votes++
      talks.insert(talk, {}, console.log);
      users.update({email:email},user,{},console.log)
      res.send(200,'SUCCESS: Talk was accepted.')
    }else{
      res.send(403,'ERROR: You are out of votes!')
    }
  })
}

function runMatchingAlgorithem(res){
  talks.find().toArray(function(err,talks){
    talks.sort(function(a,b){
      if(a.votes.length>b.votes.lenght){
        return 1;
      }else if(a.votes.length<b.votes.lenght){
        return -1;
      }else{
        return 0;
     }
    });
    for(var x = 0;x<talks.length;x++){
      talks[x].overlap = {}
      for(email in talks[x].votes){
        for(var y = 0; y< talks.length;y++){
          if(x=y){
            talks[x].overlap[talks[y]._id]=0
            continue;
          }
          for(email2 in talks[y].votes){
            if(email==email2){
              talks[x].overlap[talks[y]._id]++
            }
          }
        }
      }
    }
    var talkGrid = [[],[],[]]
    for(x=0;x<3;x++){
      if(!talks.length>0){
        break;
      }
      talkLeader = talks.shift()
      console.log(talkLeader)
      talkGrid[x][0]=talkLeader
      var currentColOver = []
      if(x>0){
        currentColOver[0]=talkGrid[x-1][0].overlap[talkLeader._id]
      }
      for(y=1; y<3; y++){
        for(z=0; z<talks.length; z++){
          var finished = false;
          if(talkLeader.overlap[talks[z]._id]>0){
            if(x>0){
              currentColOver[y]=talk[z].overlap[talkGrid[x-1][y]._id]
            }
            for(a=0; a<y; a++){
              if(currentColOver[y]>currentColOver[a]){
                if(talkGrid[x-1][a].overlap[talkGrid[x][y]._id]<currentColOver[y] && talkGrid[x-1][a].overlap[talkGrid[x][a]._id]<currentColOver[y]){
                  var previousTalk = talkGrid[x][a]
                  talkGrid[x][a]=talk.splice(z,1)[0]
                  talkGrid[x][y]=previousTalk
                  if(x>0){
                    currentColOver[a]=talkGrid[x-1][a].overlap[talkGrid[x][a]._id]
                    currentColOver[y]=talkGrid[x-1][y].overlap[talkGrid[x][y]._id]
                  }
                  finished=true;
                }
              }
            }
            if(finished){
              continue;
            }
          }else{
           finished=true;
          }
          if(!finished){
            talkGrid[x][y]=talks.splice(z,1);
            if(x>0){
              currentColOver[y]=talkGrid[x-1][y].overlap[talkGrid[x][y]._id]
            }
          }
        }
        if(!talks.length>0){
          break;
        }
      }
    }  
    res.send(JSON.stringify(talkGrid));
  })
}
