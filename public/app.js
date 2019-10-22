// Format and display each article
function displayArticle(article) {
    $("#articles-output").append(
      `<div class="article">
        <p class="article-title" data-id="${article._id}">${article.title}</p>
        <button class="article-link"><a href="${article.link}" target="_blank">Read Full Article</a></button>
        <button class="input-comment" data-id="${article._id}">Leave Comment</button>
      </div>`);
}

// Format and display each comment
function displayComment(comment) {
  $("#article-comments").append(
    `<div class='comment'>
      <h3>${comment.title}</h3>
      <p>${comment.body}</p>
    </div>`);
}

// Format and display comment input form
function displayInput(article) {
  $("#input-comment").append(
      `<h2>${article[0].title}</h2>
      <input id='comment-title' name='title'>
      <textarea id='comment-body' name='body'></textarea>
      <button data-id='${article[0]._id}' id='submit-comment'>Submit</button>`);
}

// get articles from database
$.get("/articles", function(articles) {
  articles.forEach( article => displayArticle(article));
});

// Display comment text input
$(document).on("click", ".input-comment", function() {
  $("#input-comment").empty();
  $("#article-comments").empty();
  var id = $(this).data("id");
  
  $.get(`/articles/${id}`).then(data => displayInput(data));
      
  $.get(`/comments/${id}`).then(data => {
    if (data) data.forEach(comment => displayComment(comment));
  });
});


$(document).on("click", "#submit-comment", function() {
  var id = $(this).data("id");
  var obj = {
      refID: id,
      title: $("#comment-title").val(),
      body: $("#comment-body").val()
    };

  $.post(`/articles/${id}`, obj)
    .then(function(data) {
      console.log(data);
    });
  
  $("#article-comments").empty();
  $.get(`/comments/${id}`).then(data => {
    if (data) data.forEach(comment => displayComment(comment));
  });
  
  $("#comment-title").val("");
  $("#comment-body").val("");
});