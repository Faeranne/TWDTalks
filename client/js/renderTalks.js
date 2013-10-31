var addTalk = function (title, speaker, description, id) {
    var talksDiv = $('#talks'),
        talk = $('<div></div>'),
        html = "<h1>" + title + "</h1>";
    talk.attr('id', id);
    html += "<h3>By " + speaker + "</h3>";
    html += "<p>" + description + "</p>";
    html += "<lable>Are you interested in this talk?</lable>";
    html += "<input type=button onClick='vote(" + id + ")' value='Vote'>";
    html += "<br/>";
    talk.html(html);
    talksDiv.append(talk);
    return talk;
};

var vote = function (id) {
    alert('Vote for ' + id + ' Accepted');
    $.post('/vote', {id: id});
};
$(function () {
    //TODO: Add code to retreve talks from server.
    //      These just simulate.
    addTalk('Angular Directives', 'Patrick Forrenger', 'None', 1234);
    addTalk('Google Scripts', 'Mohamid', 'None', 1235);
    addTalk('200OK', 'Luke Crouch', 'None', 1236);
});
