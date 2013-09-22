class Picture
  include Mongoid::Document
  field :preview_url, type: String
  field :actual_url, type: String
  embedded_in :text

  def self.createFromMedia(media)
  	pic =  Picture.new
  	pic.preview_url = media.media_url
  	pic.actual_url = media.media_url
  	return pic
  end
end
