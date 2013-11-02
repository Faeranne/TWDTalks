var addTalk = function (title, speaker, description, id) {
    var talksDiv = $('#talks'),
        talk = $('<div></div>'),
        html = "<h1>" + title + "</h1>";
    talk.attr('id', id);
    html += "<h3>By " + speaker + "</h3>";
    html += "<p>" + description + "</p>";
    html += "<lable>Are you interested in this talk?</lable>";
    html += "<input type=button onClick='vote(\"" + id + "\")' value='Vote'>";
    html += "<br/>";
    talk.html(html);
    talksDiv.append(talk);
    return talk;
};

var vote = function (id) {
    $.post('/vote', {id: id}).done(function(data){
      //TODO: should use a page model, instead of an annoying popup
      alert('Vote for ' + id + ' Accepted');
    }).fail(function(data){
      alert('Vote Failed.  Reason: ' + data.responseText)
      console.log(data)
    });
};

var getTalks = function () {
    var data = $.getJSON('/gettalks');
    data.done(function (data) {
        console.log(data);
        var talks = data.talks;
        console.log(talks);
        for (n in talks) {
            var talk = talks[n];
            console.log(talk);
            addTalk(talk.title, talk.speaker, talk.description, talk._id);
        };
    });
};

$(function () {
    getTalks();
});
