var windowWidth = 768;
var windowHeight = 175;
var animationTime = 1000;
var currentVotes1 = 0;
var currentVotes2 = 0;
var paper;
var circle1;
var circle2;
var name1;
var name2;
var option1;
var option2;
var Votes1Lable;
var Votes2Lable;
var circle1Radius;
var circle2Radius;
var answer1;
var answer2;
var twitterHash1 = {};
var twitterHash2 = {};
var optionsVotesQtd = {};
var optionsShortAnswers = {};
var optionsName = {};
var records = [];
var total1 = "";
var total2 = "";
var circle1Bubbles = new Array();
var circle2Bubbles = new Array();


$(document).ready(function() {

	var record = function(name, twitter_hash, short_answer_value, total_tweets, tweet_river_feed_url, tweet_phrase_value){
		this.name = name;
		this.twitter_hash = twitter_hash;
		this.short_answer_value = short_answer_value;
		this.total_tweets = total_tweets;
		this.tweet_river_feed_url = tweet_river_feed_url;
		this.tweet_phrase_value = tweet_phrase_value;
	};
	
	var getObjPropertiesTwitterFeedUrl = function getObjPropertiesTwitterFeedUrl(category){
		console.log(category);
		for (var i=0; i < records.length; i++){
			console.log(records[i].twitter_hash);
			if (records[i].twitter_hash == category){
				console.log('yes = '+records[i].tweet_river_feed_url);
				return records[i].tweet_river_feed_url;
			}
		}
	}
	
	var getObjPropertiesTweetPhrase = function getObjPropertiesTweetPhrase(category){
		for (var i=0; i < records.length; i++){
			if (records[i].twitter_hash == category){
				//console.log(TweetRecords[i].tweet_river_feed_url)
				return records[i].tweet_phrase_value;
			}
		}
	}

	function onDataReceived(response) {
		
		for (var i = 0; i < response['entity'].options.length; i++) {
		    var object = response['entity'].options[i];
			optionsVotesQtd[i] = object.total_tweets;
			optionsShortAnswers[i] = object.short_answer_value;
			optionsName[i] = object.twitter_hash;
			var newRecord = new record(object.option_name, object.twitter_hash, object.short_answer_value, object.total_tweets, object.tweet_river_feed_url, object.tweet_phrase_value)
			records.push(newRecord);
		}
		
		answer1 = optionsShortAnswers[0];
		answer1.key = optionsName[0];
		
		answer2 = optionsShortAnswers[1];
		answer2.key = optionsName[1];
		
	
		var votes1 = optionsVotesQtd[0];
		var votes2 = optionsVotesQtd[1];
		
		twitterHash1.name = optionsName[0];
		twitterHash1.key = optionsName[0];
		
		twitterHash2.name = optionsName[1];
		twitterHash2.key = optionsName[1];
		
	    paper = Raphael(0, 0, windowWidth, windowHeight);
	    circle1 = paper.circle(windowWidth/4, windowHeight/2, 0);
	    circle2 = paper.circle((windowWidth/4)*3, windowHeight/2, 0);

	    name1 = paper.text(windowWidth/4, windowHeight/2, twitterHash1.name);
		name1.id = optionsName[0];

	    name2 = paper.text((windowWidth/4)*3, windowHeight/2, twitterHash2.name);
		name2.id = optionsName[1];

	    option1 = paper.text(windowWidth/4, windowHeight/2, answer1);
		option1.id = optionsName[0];
		
	    option2 = paper.text((windowWidth/4)*3, windowHeight/2, answer2);
		option2.id = optionsName[1];


	    Votes1Lable = paper.text(windowWidth/4, windowHeight/2, "");
	    Votes2Lable = paper.text((windowWidth/4)*3, windowHeight/2, "");

	    name1.attr({ "font-size": 0 });
	    name2.attr({ "font-size": 0 });
	    option1.attr({ "font-size": 0 });
	    option1.attr({ "font-weight": "bold" });
	
	    option2.attr({ "font-size": 0 });
	    option2.attr({ "font-weight": "bold" });
	
	    Votes1Lable.attr({ "font-size": 0 });
	    Votes2Lable.attr({ "font-size": 0 });

	    option1.click(function (event) {
			var value = this.id;
			NativeBridge.call("tweet", [value, getObjPropertiesTwitterFeedUrl(value), getObjPropertiesTweetPhrase(value)],function (response){});
	    });

	    option2.click(function (event) {
			var value = this.id;
			NativeBridge.call("tweet", [value, getObjPropertiesTwitterFeedUrl(value), getObjPropertiesTweetPhrase(value)],function (response){});
		});

	    name1.click(function (event) {
			var value = this.id;
			NativeBridge.call("prompt", [value, getObjPropertiesTwitterFeedUrl(value), getObjPropertiesTweetPhrase(value)],function (response){});
		});

	    name2.click(function (event) {
			var value = this.id;
			NativeBridge.call("prompt", [value, getObjPropertiesTwitterFeedUrl(value), getObjPropertiesTweetPhrase(value)],function (response){});
		});

		draw(parseInt(votes1), parseInt(votes2));

     }

	function fetchData() {
        $.ajax({
			url: "http://166.77.206.226:8888/poll.json",
            method: 'GET',
            dataType: 'json',
            success: onDataReceived
        });
    }

	fetchData();
	
});

    function draw(votes1, votes2) {
        updateVotesVisualization(votes1,votes2);
    }

    function updateVotesVisualization(Votes1, Votes2) {
        var totalVotes = (Votes1 + Votes2);
        if ((windowWidth/4) < windowHeight/2)   {
            circle1Radius = ((Votes1/totalVotes)*((windowWidth)/2));
            circle2Radius = ((Votes2/totalVotes)*((windowWidth)/2));
        }
        else    {
            circle1Radius = ((Votes1/totalVotes)*(windowHeight)/2);
            circle2Radius = ((Votes2/totalVotes)*(windowHeight)/2);
        }
        circle1.animate({r: circle1Radius}, animationTime);
        circle2.animate({r: circle2Radius}, animationTime);
        if (circle1Radius > 36)  {
            name1.animate({"font-size": circle1Radius/3.3, x: windowWidth/4, y: windowHeight/2}, animationTime);
            option1.animate({"font-size": circle1Radius/3.3, x: windowWidth/4, y: ((windowHeight/2)-circle1Radius/3.3 - 5)}, animationTime);
            Votes1Lable.animate({"font-size": circle1Radius/3.3, x: windowWidth/4, y: ((windowHeight/2)+circle1Radius/3.3 + 5)}, animationTime);
            Votes1Lable.attr({text: Votes1});
        }
        else    {
            name1.animate({"font-size": 16, x: circle1Radius+(windowWidth/4 - 60), y: (windowHeight/2 - 20)-circle1Radius}, animationTime);
            option1.animate({"font-size": 16, x: circle1Radius+(windowWidth/4 - 60), y: (windowHeight/2 - 41)-circle1Radius}, animationTime);
            Votes1Lable.animate({"font-size": 16, x: circle1Radius+(windowWidth/4 - 60), y: (windowHeight/2 + 1)-circle1Radius}, animationTime);
            Votes1Lable.attr({text: Votes1});
        }
        if (circle2Radius > 36)  {
            name2.animate({"font-size": circle2Radius/3.3, x: ((windowWidth/4)*3), y: windowHeight/2}, animationTime);
            option2.animate({"font-size": circle2Radius/3.3, x: ((windowWidth/4)*3), y: ((windowHeight/2)-circle2Radius/3.3 - 5)}, animationTime);
            Votes2Lable.animate({"font-size": circle2Radius/3.3, x: ((windowWidth/4)*3), y: ((windowHeight/2)+circle2Radius/3.3 + 5)}, animationTime);
            Votes2Lable.attr({text: Votes2});
        }
        else    {
            name2.animate({"font-size": 16, x: circle2Radius+(((windowWidth/4)*3) + 10), y: (windowHeight/2 - 20)-circle2Radius}, animationTime);
            option2.animate({"font-size": 16, x: circle2Radius+(((windowWidth/4)*3) + 10), y: (windowHeight/2 - 41)-circle2Radius}, animationTime);
            Votes2Lable.animate({"font-size": 16, x: circle2Radius+(((windowWidth/4)*3) + 10), y: (windowHeight/2 + 1)-circle2Radius}, animationTime);
            Votes2Lable.attr({text: Votes2});
        }
        setTimeout(smallCircleAnimation, animationTime + 1000);
        VoteBubbleAnimation1((Votes1 - currentVotes1),(Votes1 - currentVotes1),(animationTime/(Votes1 - currentVotes1)));
        VoteBubbleAnimation2((Votes2 - currentVotes2),(Votes2 - currentVotes1),(animationTime/(Votes2 - currentVotes2)));
        currentVotes1 = Votes1;
        currentVotes2 = Votes2;
    }
    function VoteBubbleAnimation1(NumberOfCircles, Time) {
        if (NumberOfCircles > 0)   {
            var angle = Math.random()*(Math.PI*2);
            circle1Bubbles[NumberOfCircles] = paper.circle((windowWidth/4 + (Math.cos(angle)*(circle1Radius + 100))), (windowHeight/2 + (Math.sin(angle)*(circle1Radius + 50))), 5);
            circle1Bubbles[NumberOfCircles].animate({cx: windowWidth/4 + (Math.cos(angle)*circle1Radius), cy: windowHeight/2 + (Math.sin(angle)*circle1Radius), opacity: 0}, 300);
            circle1Bubbles[NumberOfCircles].attr("fill", "#f00");
            circle1Bubbles[NumberOfCircles].attr("stroke", "#f00");
           	setTimeout("circle1Bubbles["+NumberOfCircles+"].remove()", 300);
            setTimeout("VoteBubbleAnimation1(" + (NumberOfCircles - 1)+"," + Time + ")", Time);
        }
    }
    function VoteBubbleAnimation2(NumberOfCircles, Time) {
        if (NumberOfCircles > 0)   {
            var angle = Math.random()*(Math.PI*2);
            circle2Bubbles[NumberOfCircles] = paper.circle(((windowWidth/4)*3 + (Math.cos(angle)*(circle2Radius + 100))), (windowHeight/2 + (Math.sin(angle)*(circle2Radius + 50))), 5);
            circle2Bubbles[NumberOfCircles].animate({cx: (windowWidth/4)*3 + (Math.cos(angle)*circle2Radius), cy: windowHeight/2 + (Math.sin(angle)*circle2Radius), opacity: 0}, 300);
            circle2Bubbles[NumberOfCircles].attr("fill", "green");
            circle2Bubbles[NumberOfCircles].attr("stroke", "green");
           	setTimeout("circle2Bubbles["+NumberOfCircles+"].remove()", 300);
            setTimeout("VoteBubbleAnimation2(" + (NumberOfCircles - 1)+"," + Time + ")", Time);
        }
    }
    function smallCircleAnimation() {
        if (circle1Radius < 5)    {
            var expandingCircle = paper.circle(windowWidth/4, windowHeight/2, circle1Radius);
            expandingCircle.attr({stroke: "blue"});
            expandingCircle.animate({r: circle1Radius + 10}, 1000);
            expandingCircle.animate({opacity: 0}, 1000);
            setTimeout(smallCircleAnimation, 3000);
        }
        else if (circle2Radius < 5) {
            var expandingCircle = paper.circle((windowWidth/4)*3, windowHeight/2, circle2Radius);
            expandingCircle.attr({stroke: "blue"});
            expandingCircle.animate({r: circle2Radius + 10}, 1000);
            expandingCircle.animate({opacity: 0}, 1000);
            setTimeout(smallCircleAnimation, 3000);
        }
    }
		
		setInterval(function() {
			console.log('aa');
			$.ajax({ type: "GET", url: "http://www.logoslogic.com/chat/LivingRoom/graph/poll.json", dataType: 'json',
				success: function(data) {

					for (var i = 0; i < data['entity'].options.length; i++) {
					    var object = data['entity'].options[i];
						optionsVotesQtd[i] = object.total_tweets;
					}


				//	var votes1 = parseInt(optionsVotesQtd[0])+100;
				//	var votes2 = parseInt(optionsVotesQtd[1])+50;
				
				//	Values for Demo:
					if (total1 == ""){
						total1 = parseInt(optionsVotesQtd[0]);
						total2 = parseInt(optionsVotesQtd[1]);
					}
					
					var votes1 = total1+(Math.floor(Math.random()*10)*2);
					var votes2 = total2+(Math.floor(Math.random()*10)*2);
				
					total1 = votes1;
					total2 = votes2;
					
					console.log(votes1);
					draw (votes1, votes2);

		        },
		        error: function(req, text, error) {
		           // console.log('error')
                       }
				});
					
					
					
		}, 5000);