function daysBetween(first, second) {

    // Copy date parts of the timestamps, discarding the time parts.
    var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
    var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

    // Do the math.
    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var millisBetween = two.getTime() - one.getTime();
    var days = millisBetween / millisecondsPerDay;

    // Round down.
    return Math.floor(Math.abs(days));
}

function dateToString(date){
	var m_names = new Array("January", "February", "March", 
"April", "May", "June", "July", "August", "September", 
"October", "November", "December");
	return date.getDate() + " " + m_names[date.getMonth()] + " " + date.getFullYear();
}

function paintError(message){

	if (!(typeof message == 'string' || message instanceof String)){
		message = "There was an error getting the information";
	}
	var container = $("#content");

	container.empty();
	$("<div />",{
		class: "error-message",
		text: message
	}).appendTo(container);

}

function paintResults(result){

	var container = $("#content");

	var lastDate = new Date();

	//Every story
	for (var i = 0; i < result.length; i++) {
		var story = result[i];

		//Check day change
		var tempDate = new Date(story.updated_date);
		if( daysBetween(tempDate,lastDate) >= 1 ){
			$("<div />",{
				class: "date",
				text: dateToString(tempDate)
			}).appendTo(container);
		}
		lastDate = tempDate;

		var element = $("<div />",{class: "story"});

		// Every text
		for (var j = 0; j < story.texts.length; j++) {
			var text = $("<div />",{class: "text"});
			if (story.texts[j].pictures !== undefined){

				//Every image
				for (var k = 0; k < story.texts[j].pictures.length; k++) {
					text.append($("<img />",{
						src: story.texts[j].pictures[k].preview_url,
						class: "pull-right",
						on: { "click" : function(picture){
							return function(){
								$("#imageLightbox-image").attr("src",picture.actual_url);
								$("#imageLightbox").lightbox();
								$(".lightbox-content").click(function(){
									$("#imageLightbox").click();
								});
							}
						}(story.texts[j].pictures[k])}
					}));
				};
			}

			text.append("<p>"+story.texts[j].content+"</p>");
			element.append(text);
		};
		container.append(element);
	};

	$(".loader").remove();
}

function paintLoader(){

	var container = $("#content");

	container.empty();
	$("<div />",{ class: "loader" })
		.append($("<img />",{ src: "/ajax-loader.gif" }))
		.appendTo(container);

}

function fetchStories(){
	var data = $.ajax({
		dataType: "json",
		url: "/api/stories.json",
		error: paintError
	});
	data.then(paintResults);
};

function setActiveLink(linkName){
	$(".nav > li").removeClass("active");
	$("#"+linkName+"-link").addClass("active");
	$("#"+linkName+"-link > a").blur();
}

var sammyApp = $.sammy(function() {  
  
    this.element_selector = '#content';  
      
    this.get('#/stories', function(context) {
    	setActiveLink("stories");  
    	context.app.swap(''); 
    	paintLoader(); 
    	fetchStories();
	}); 

	this.get('#/photos', function(context) {
		setActiveLink("photos");
		context.app.swap('');
		paintError("This hasn't been completed yet. Check back later.");
	});
  
});

$(function() {  
  sammyApp.run('#/stories');  
});


