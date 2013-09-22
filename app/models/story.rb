class Story
  include Mongoid::Document
  field :updated_date, type: Time
  field :last_id, type: Integer
  embeds_many :texts

  def self.fetch_from_twitter

  	client = AbroadTwitter.getClient
  	
	if !client
		return
	end

	texts = []
	options = {
		:count => 200,
		:trim_user => true,
		:exclude_replies => true,
		:include_entities => true
	}

	currentStory = Story.new(:texts => [])
	prevText = nil

	if !Story.all.empty?
		currentStory = Story.all.desc(:updated_date).first
		options[:since_id] = currentStory.last_id
		prevText = currentStory.texts.last
	end

	while(true)
		tweets = client.user_timeline("abroadguille", options)
		tweets.each do |tweet|
			texts << Text.parse(tweet)
		end

		if tweets.length == 0
			break
		else
			options[:max_id] = tweets.last.id - 1
		end
	end

	if texts.empty?
		return
	end

	texts = texts.reverse()

	texts.each do |text|

		if prevText && far_appart(prevText,text)
			currentStory.finish()
			currentStory = Story.new(:texts => [text])
		else
			currentStory.texts << text
		end

		prevText = text

	end

	if currentStory.texts.length > 0
		currentStory.finish()
	end

  end

  def finish
  	#self.texts = self.texts.reverse
  	self.updated_date = self.texts.last.date
  	self.last_id = self.texts.last.tweet_id
  	self.save
  end

  def self.far_appart(text1,text2)

		time1 = text1.date
		time2 = text2.date

		if (time1 - time2).abs > 16 * 60
			return true
		else
			return false
		end

	end
end
