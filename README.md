#TWDTalks
_____

TWDTalks is a management page to allow Tulsa Web Devs' to add and vote on talks for the monthly meetings.

##Install
_____

To install,
  Set DBURL, DBUSER, and DBPASS environment variables to your Database URL, Username, and Password respectivly.
  Run npm install
  Run node app.js
  
##Register
_____

TWDTalks uses Mozilla's Persona login to manage users.  By default all users are denied access.  To authorize a user, simply set the Auth variable in the users page to true.  Eventualy I'll create a management page for that.

##Misc
_____

As always, pull requests are welcome.  If you are using this in your group, I would love to hear about it.