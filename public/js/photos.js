var Photos = function(){

	var selectedSet = "set-all";

	// Container of the gallery
	var gallery = $("#photo-gallery");

	// The html needed for each item
	var itemHtml = gallery.html();
	gallery.empty();

	var totalPhotos = 0;
	var checkFinishedLoading = function(){
		if(totalPhotos == 0){
			$(".loader").hide();
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
		// Bind handlers to the error and load events.
		image.load( function(element){
			return function(){
				gallery.isotope('insert', element);
				totalPhotos -= 1;
				checkFinishedLoading();
			}
		}(element));
		image.error( function(){
			totalPhotos -= 1;
			checkFinishedLoading();
		});

		// AFTER setting the handlers change the src to trigger the load
		image.attr("src",buildUrl(flickrPhoto));

		// In case the image has been cached
		if (image.complete){
			gallery.isotope('insert', element);	
			totalPhotos -= 1;
			checkFinishedLoading();
		}
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

	var appendAlbum = function(info){
		var element = $("<li />",{
			class: "set-"+info.id
		});
		element.append($("<a />",{
			href: "#/photos/set/"+info.id,
			text: info.title._content
		}));
		if (selectedSet == "set-"+info.id){
			element.addClass("active");
		}
		$("#album-list").append(element);
	}

	var appendAllPhotosAlbum = function(){
		var element = $("<li />",{
			class: "set-all"
		});
		element.append($("<a />",{
			href: "#/photos",
			text: "All photos"
		}));
		if (selectedSet == "set-all"){
			element.addClass("active");
		}
		$("#album-list").append(element);	
	}

	var setSetSelected = function(className){
		selectedSet = className;
		$("#album-list > li").removeClass("active");
		$("#album-list > li."+className).addClass("active");
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


	//Load albums
	
	appendAllPhotosAlbum();

	var flickerAlbumsUrl = "http://api.flickr.com/services/rest/?method=flickr.photosets.getList";
	flickerAlbumsUrl += "&user_id=101942945@N05";
	flickerAlbumsUrl += "&format=json";
	flickerAlbumsUrl += "&api_key=29b46709a75f0bbc43c1ae75df395069";
	flickerAlbumsUrl += "&jsoncallback=?";

	$.getJSON(flickerAlbumsUrl).then(function(result){
		var setList = result.photosets.photoset;
		for (var i = 0; i < setList.length; i++) {
			appendAlbum(setList[i]);
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

	var loadPhotosFromUrl = function(flickrPhotoURL, listObtainer){
		$(".loader").show();
		$.getJSON(flickrPhotoURL).then(function(result){
			var photoList = listObtainer(result);
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
	}

	var removeAll = function(){
		gallery.isotope("remove", gallery.find(".photo-item"));
	}


	return {
		loadAll: function(){
			removeAll();
			//Load with Flickr's JSONp the sets and the pictures.
			var flickrPhotoURL = "http://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos"
			flickrPhotoURL += "&user_id=101942945@N05";
			flickrPhotoURL += "&format=json";
			flickrPhotoURL += "&extras=tags";
			flickrPhotoURL += "&api_key=29b46709a75f0bbc43c1ae75df395069";
			flickrPhotoURL += "&jsoncallback=?";

			loadPhotosFromUrl(flickrPhotoURL, function(result){ return result.photos.photo;});
			setSetSelected("set-all");
		},
		loadSet: function(setId){
			removeAll();

			var flickrPhotoURL = "http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos";
			flickrPhotoURL += "&photoset_id="+setId;
			flickrPhotoURL += "&format=json";
			flickrPhotoURL += "&extras=tags";
			flickrPhotoURL += "&api_key=29b46709a75f0bbc43c1ae75df395069";
			flickrPhotoURL += "&jsoncallback=?";			

			loadPhotosFromUrl(flickrPhotoURL, function(result){ return result.photoset.photo;});
			setSetSelected("set-"+setId);
		}
	}

}();