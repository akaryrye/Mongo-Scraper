$.getJSON("/articles", function(data) {
  for (var i = 0; i < data.length; i++) {
    let id = data[i]._id,
      title = data[i].title,
      link = data[i].link;

    $("#articles").append(
      `<p data-id='${id}'>${title}<br>${link}</p>`);
  }
});


$(document).on("click", "p", function() {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({ method: "GET", url: "/articles/" + thisId })
      .then(function(data) {
        console.log(data);
        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      if (data.note) {
        $("#titleinput").val(data.note.title);
        $("#bodyinput").val(data.note.body);
      }
    });
});


$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");
  var object = {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }

  $.ajax({ 
    method: "POST",
    url: "/articles/" + thisId,
    data: object
  })
    .then(function(data) {
      console.log(data);
      $("#notes").empty();
    });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});