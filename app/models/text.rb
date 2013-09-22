class Text
  include Mongoid::Document
  field :content, type: String
  field :date, type: Time
  field :tweet_id, type: Integer
  embedded_in :stories
  embeds_many :pictures

  def self.parse(tweet)

  	res = Text.new({:date => tweet.created_at, :tweet_id => tweet.id, :pictures => []})

  	text = tweet.text

  	media = tweet.media
  	media.each do |photo|
  		res.pictures << Picture.createFromMedia(photo)
  		text.slice! photo.url
  	end

  	res.content = text

  	return res

  end
end

#<Twitter::Tweet:0x007f9294ea08e8 @attrs={:created_at=>"Mon Sep 02 13:09:05 +0000 2013", :id=>374519348901457920, :id_str=>"374519348901457920", :text=>"RT @Erpheus: The Holy Links in intro to web applications: http://t.co/tcALQvdOvh", :source=>"<a href=\"http://tapbots.com/tweetbot\" rel=\"nofollow\">Tweetbot for iOS</a>", :truncated=>false, :in_reply_to_status_id=>nil, :in_reply_to_status_id_str=>nil, :in_reply_to_user_id=>nil, :in_reply_to_user_id_str=>nil, :in_reply_to_screen_name=>nil, :user=>{:id=>1697270299, :id_str=>"1697270299"}, :geo=>nil, :coordinates=>nil, :place=>nil, :contributors=>nil, :retweeted_status=>{:created_at=>"Mon Sep 02 11:39:31 +0000 2013", :id=>374496807189225472, :id_str=>"374496807189225472", :text=>"The Holy Links in intro to web applications: http://t.co/tcALQvdOvh", :source=>"<a href=\"http://tapbots.com/tweetbot\" rel=\"nofollow\">Tweetbot for iOS</a>", :truncated=>false, :in_reply_to_status_id=>nil, :in_reply_to_status_id_str=>nil, :in_reply_to_user_id=>nil, :in_reply_to_user_id_str=>nil, :in_reply_to_screen_name=>nil, :user=>{:id=>45607566, :id_str=>"45607566"}, :geo=>nil, :coordinates=>nil, :place=>nil, :contributors=>nil, :retweet_count=>1, :favorite_count=>0, :entities=>{:hashtags=>[], :symbols=>[], :urls=>[], :user_mentions=>[], :media=>[{:id=>374496806690111488, :id_str=>"374496806690111488", :indices=>[45, 67], :media_url=>"http://pbs.twimg.com/media/BTJ63IxIQAA8swR.jpg", :media_url_https=>"https://pbs.twimg.com/media/BTJ63IxIQAA8swR.jpg", :url=>"http://t.co/tcALQvdOvh", :display_url=>"pic.twitter.com/tcALQvdOvh", :expanded_url=>"http://twitter.com/Erpheus/status/374496807189225472/photo/1", :type=>"photo", :sizes=>{:large=>{:w=>1024, :h=>765, :resize=>"fit"}, :small=>{:w=>340, :h=>254, :resize=>"fit"}, :thumb=>{:w=>150, :h=>150, :resize=>"crop"}, :medium=>{:w=>600, :h=>448, :resize=>"fit"}}}]}, :favorited=>false, :retweeted=>false, :possibly_sensitive=>false, :lang=>"en"}, :retweet_count=>1, :favorite_count=>0, :entities=>{:hashtags=>[], :symbols=>[], :urls=>[], :user_mentions=>[{:screen_name=>"Erpheus", :name=>"Erpheus", :id=>45607566, :id_str=>"45607566", :indices=>[3, 11]}], :media=>[{:id=>374496806690111488, :id_str=>"374496806690111488", :indices=>[58, 80], :media_url=>"http://pbs.twimg.com/media/BTJ63IxIQAA8swR.jpg", :media_url_https=>"https://pbs.twimg.com/media/BTJ63IxIQAA8swR.jpg", :url=>"http://t.co/tcALQvdOvh", :display_url=>"pic.twitter.com/tcALQvdOvh", :expanded_url=>"http://twitter.com/Erpheus/status/374496807189225472/photo/1", :type=>"photo", :sizes=>{:large=>{:w=>1024, :h=>765, :resize=>"fit"}, :small=>{:w=>340, :h=>254, :resize=>"fit"}, :thumb=>{:w=>150, :h=>150, :resize=>"crop"}, :medium=>{:w=>600, :h=>448, :resize=>"fit"}}, :source_status_id=>374496807189225472, :source_status_id_str=>"374496807189225472"}]}, :favorited=>false, :retweeted=>false, :possibly_sensitive=>false, :lang=>"en"}, @created_at=2013-09-02 15:09:05 +0200>
