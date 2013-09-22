class RssController < ApplicationController
  
  	def feed
		# this will be the name of the feed displayed on the feed reader
		@title = "Abroad Guille"

		# the news items
		@feed_items = FeedItem.all
		@feed_items = @feed_items

		# this will be our Feed's update timestamp
		@updated = @feed_items.first.updated_at unless @feed_items.empty?

		respond_to do |format|
			format.atom { redirect_to feed_path(:format => :rss), :status => :moved_permanently }
			# we want the RSS feed to redirect permanently to the ATOM feed
			format.rss { render :layout => false }
		end
	end

end
