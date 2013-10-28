class Api::SubscriptionController < ApplicationController

	require 'mailchimp'

	def subscribe
		list = params[:list]
		id = 0;

		if list == "daily"
			id = "3cf657e1e4"
		elsif list == "3days"
			id = "8ddf6667af"
		elsif list == "weekly"
			id = "29fd9ed9aa"
		else
			result = "List not found"
		end

		unless id == 0
			result = mailchimpSubscribe(id,params[:email])
		end

		if result == true
			respond_to do |format|
      			format.json  { render :json => {:result => :ok}, :status => :ok }
    		end
		else
			respond_to do |format|
      			format.json  { render :json => {:error => result}, :status => 500 }
    		end
		end
	end


	private

	def mailchimpSubscribe(subsId,email)
		@mc = Mailchimp::API.new('b2abe90ef84f9500ebd4bc6fa957f267-us3')
		begin
			#batch-subscribe
	    	@mc.lists.subscribe(subsId, {:email => email}, nil, 'html', false)
	    	return true
	    rescue Mailchimp::ListAlreadySubscribedError
	    	return "already subscribed"
	    rescue Mailchimp::ListDoesNotExistError
	    	return "list doesn't exist"
	    rescue Mailchimp::Error => ex
	    	if ex.message
        		return ex.message
      		else
        		return "An unknown error occurred"
      		end
	    end
	end

end