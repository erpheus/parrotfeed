

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

function setActiveLink(linkName){
	$(".nav > li").removeClass("active");
	$("#"+linkName+"-link").addClass("active");
	$("#"+linkName+"-link > a").blur();
}

function paintLoader(){

    var container = $("#content");

    container.empty();
    

}

var sammyApp = $.sammy(function() {

	this.use("Template");  
  
    this.element_selector = '#content';  
      
    this.get('#/stories', function(context) {
    	setActiveLink("stories");  
    	context.app.swap('');
    	this.partial("content/stories.template");
    	//paintLoader();
	}); 

	this.get('#/photos', function(context) {
		setActiveLink("photos");
		context.app.swap('');
		this.partial("content/photos.template");
	});
  
});

$(function() {  
  sammyApp.run('#/stories');  
});


