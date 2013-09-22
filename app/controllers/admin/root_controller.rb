class Admin::RootController < ApplicationController

	http_basic_authenticate_with name: ENV['ABROADGUILLE_APP_USERNAME'], password: ENV['ABROADGUILLE_APP_PASSWORD']

	def index
		@nStories = Story.all.length
		if AbroadTwitter.getClient
			@message = "There is a twitter account authorized"
		else
			@message = "No account has been authorized yet"
		end
	end

	def feedDatabase

		Story.fetch_from_twitter()

		redirect_to admin_root_path()
	end

	def startTwitter
		require 'oauth'

		consumer = get_consumer

	    # Get a request token from Twitter
	    @request_token = consumer.get_request_token :oauth_callback => ('http://' + request.env['HTTP_HOST'] + '/admin/returnTwitter')

	    # Store the request token's details for later
	    session[:request_token] = @request_token.token
	    session[:request_secret] = @request_token.secret
	    
	    # Hand off to Twitter so the user can authorize us
	    redirect_to @request_token.authorize_url
	end

	def returnTwitter
		require 'oauth'

		consumer = get_consumer
		
	    # Re-create the request token
	    @request_token = OAuth::RequestToken.new(consumer, session[:request_token], session[:request_secret])
	    
	    # Convert the request token to an access token using the verifier Twitter gave us
	    @access_token = @request_token.get_access_token(:oauth_verifier =>
	        params[:oauth_verifier])

	    # Store the token and secret that we need to make API calls
	    AbroadTwitter.store(@access_token.token, @access_token.secret)

	    # Hand off to our app, which actually uses the API with the above token and secret
	    redirect_to admin_root_path()
	end

	private 

	def get_consumer
		OAuth::Consumer.new(
      		ENV['ABROADGUILLE_TWITTER_TOKEN'],
      		ENV['ABROADGUILLE_TWITTER_SECRET'],
      		{:site => 'https://api.twitter.com'}
    	)
	end

end
