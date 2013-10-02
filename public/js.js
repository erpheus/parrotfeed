$(function(){
	var data = $.getJSON("/api/stories.json")
	var container = $("#content");
	data.then(function(result){
		for (var i = 0; i < result.length; i++) {
			var story = result[i];
			var element = $("<div />",{class: "story"});
			for (var j = 0; j < story.texts.length; j++) {
				var text = $("<div />",{class: "text"});
				if (story.texts[j].pictures !== undefined){
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
	});
});