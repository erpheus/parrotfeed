class FeedItem
	include Mongoid::Document
    attr_accessor :title, :content, :updated_at, :id

    def self.all
    	return Story.all.desc(:updated_date).map do |story|
			FeedItem.create(story)
    	end
    end

    def self.create(story)
    	feed = FeedItem.new
    	feed.title = story.texts.first.content[0..60] + "..."
    	feed.updated_at = story.updated_date
    	feed.id = story.id
    	feed.content = ""
    	story.texts.each do |text|
    		feed.content += FeedItem.textToHtml(text)
    	end
    	return feed
    end

    def author_name
    	return "Abroad Guille"
    end

    def self.textToHtml(text)
    	result = "<p>"+text.content+"</p>"
    	text.pictures.each do |picture|
    		result += "<img src='"+picture.actual_url+"' />"
    	end
    	return result
    end
end