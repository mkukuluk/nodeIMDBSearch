var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var bodyParser = require('body-parser');
app.use(bodyParser());

app.get('/', function(req, res){
  // The form's action is '/' and its method is 'POST',
  // so the `app.post('/', ...` route will receive the
  // result of our form
  var html = '<form action="/" method="post">' +
               'Enter random number or search a movie name:' +
               '<input type="text" name="movieName" placeholder="..." />' +
               '<br>' +
               '<button type="submit">Submit</button>' +
            '</form>';

  res.send(html);
});


/* app.post('/', function(req, res){
  var userName = req.body.userName;
  var html = 'Hello: ' + userName + '.<br>' +
             '<a href="/">Try again.</a>';
  res.send(html);
}); */


app.post('/', function(req, res){



  var movieName = req.body.movieName;
  var isNumber = 0;
  if (isNaN(movieName)) 
  {
    url = 'http://www.imdb.com/find?q='+movieName+'&s=tt';
	isNumber =0;
  }
  else{
	  url = 'http://www.imdb.com/title/tt'+movieName+'/';
	  isNumber = 1;
  }
  
  //
 
  console.log(url);
  console.log(isNumber);
  request(url, function(error, response, html){
    if(!error){






      var $ = cheerio.load(html);

      var title, release, rating;
      var json = { title : "", release : "", rating : ""};

      $('.title_wrapper').filter(function(){
        var data = $(this);
		
        title = data.children().first().text().trim();
        release = data.children().last().children().last().text().trim();

        json.title = title;
        json.release = release;
      })

   
	  
	   $('.ratingValue').filter(function(){
        var data = $(this);
        rating = data.text();

        json.rating = rating;
    })

	  
	  

	  //test code
	var tdtotal = "";

	
    $('.result_text').each(function(){
		
         tdtotal += ($(this).html())+'.<br>'; // will give you the value.
    });

	//end test

    }

    /* fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
      console.log('File successfully written! - Check your project directory for the output.json file');
    }) */
	if(isNumber == 1){
		var html = 'Movie: ' + title + '.<br>' +'Release: ' + release + '.<br>' + 'Rating: ' + rating + '.<br>' +'.<br>'+ tdtotal+
             '<a href="/">Try again.</a>';
	}
	else{
		var html = tdtotal+
             '<a href="/">Try again.</a>';
	}
 
  res.send(html);

    //res.send(JSON.stringify(json, null, 4))
  })
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;