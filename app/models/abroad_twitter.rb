class AbroadTwitter
	include Mongoid::Document
	field :oauth_token, type: String
	field :oauth_secret, type: String

	def self.store(token,secret)
		#Remove all previous tokens
		AbroadTwitter.all.each do |a|
			a.remove()
		end
		a = AbroadTwitter.new(:oauth_token => token, :oauth_secret => secret)
		a.save
	end

	def self.getClient
		if AbroadTwitter.all.empty?
			return nil
		end
		credentials = AbroadTwitter.all.first
		return Twitter::Client.new(
  			:oauth_token => credentials.oauth_token,
  			:oauth_token_secret => credentials.oauth_secret
		)
	end

end