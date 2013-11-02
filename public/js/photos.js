var loadedPhotos = function(){

	// Container of the gallery
	var gallery = $("#photo-gallery");

	// The html needed for each item
	var itemHtml = gallery.html();
	gallery.empty();

	var totalPhotos = 0;
	var checkFinishedLoading = function(){
		if(totalPhotos == 0){
			$(".loader").remove();
		}
	}

	// Useful methods
	var buildUrl = function(flickrPhoto, original){
		var baseUrl = "http://farm"+flickrPhoto.farm+".staticflickr.com/"+flickrPhoto.server+"/"+flickrPhoto.id+"_"+flickrPhoto.secret;
		if (original){
			return baseUrl + "_b.jpg";
		}else{
			return baseUrl + "_m.jpg";
		}
	}

	var setUpLink = function(element, flickrPhoto){
		var url = buildUrl(flickrPhoto, true);
		element.find("a").bind("click", function(url, element){
			return function(){
				var image = $("#imageLightbox-image");
				if ( image.attr("src") != url ){
					var stopLoadingAnimation = startLoadingAnimation(element);
					image.attr("src",url).load(function(){
						stopLoadingAnimation();
					});
				}
				$("#imageLightbox").lightbox();
				$(".lightbox-content").click(function(){
					$("#imageLightbox").click();
				});
			}
		}(url, element));
	}

	var appendPhoto = function(flickrPhoto, index){
		var element = $(itemHtml);
		element.data("image-index",index);
		setUpLink(element,flickrPhoto);
		var image = element.find("img");
		image.attr("src",buildUrl(flickrPhoto));
		image.load(function(element){
			return function(){
				gallery.isotope('insert', element);
				totalPhotos -= 1;
				checkFinishedLoading();
			}
		}(element));
	}

	var tagsInclude = function(tags, tag){
		var list = tags.split(" ");
		for (var i = 0; i < list.length; i++) {
			if (list[i] == tag){
				return true;
			}
		};
		return false;
	}

	// Start isotope
	gallery.isotope({
		itemSelector : '.photo-item',
		getSortData : {
		  	index : function ( elem ) {
		    	return elem.data('image-index');
		  	}
		}
    });
    gallery.isotope({ sortBy : 'index' });


	//Load with Flickr's JSONp the sets and the pictures.
	var flickrURL = "http://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos"
	flickrURL += "&user_id=101942945@N05";
	flickrURL += "&format=json";
	flickrURL += "&extras=tags";
	flickrURL += "&api_key=29b46709a75f0bbc43c1ae75df395069";
	flickrURL += "&jsoncallback=?";

	$.getJSON(flickrURL).then(function(result){
		var photoList = result.photos.photo;
		totalPhotos += photoList.length;
		for (var i = 0; i < photoList.length; i++) {
			if (! tagsInclude(photoList[i].tags, "nowebsite")){
				appendPhoto(photoList[i],i);
			}else{
				totalPhotos -= 1;
				checkFinishedLoading();
			}
		};
	});


	// jquery flickr like animation
	 
	// returns a function that stops the animation
	var startLoadingAnimation = function(element){
	    var wwidth = element.find(".photo-container").width();

	    var overlay = element.find(".photo-loading-overlay");

	    // Create balls
	    var blueBall = $("<div class='ball blue' />");
	    var pinkBall = $("<div class='ball pink' />");

	    overlay.append(blueBall).append(pinkBall);

	    var yPos = (overlay.height()/2) - (blueBall.height()/2);

	    blueBall.css("top",yPos+"px");
	    pinkBall.css("top",yPos+"px");

	    var ballWidth = blueBall.width();

	    blueBall.css("left", (wwidth/2) - ballWidth);

	    var movex = blueBall.width() + 4;
	    pinkBall.css("left", blueBall.position().left + movex);

	    var stop = false;

	    var clean = function(){
	    	overlay.css("visibility","hidden");
	    	overlay.empty();
	    }

	    overlay.css("visibility","visible");
	    crossBalls(blueBall,pinkBall);

	    function crossBalls(ball1,ball2) {
	    	if (stop){
	    		clean();
	    		return;
	    	}
	    	var complete = 2;
	        ball1.animate({
	            left: '+='+movex
	        }, 800, function() {
	            ball1.css("z-index", "1");
	            complete -= 1;
	            if (complete == 0){
	            	crossBalls(ball2,ball1);
	            }
	        });
	        ball2.animate({
	            left: '-='+movex
	        }, 800, function() {
	            ball2.css("z-index", "2");
	            complete -= 1;
	            if (complete == 0){
	            	crossBalls(ball2,ball1);
	            }
	        });
	    }

	    return function(){
	    	stop = true;
	    }

	    
	};



}();