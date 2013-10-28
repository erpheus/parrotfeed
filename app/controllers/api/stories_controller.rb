class Api::StoriesController < ApplicationController
  # GET /stories
  def index
    @stories = Story.all.desc(:updated_date)

    respond_to do |format|
      format.json { render json: @stories }
    end
  end

  # GET /stories/1
  def show
    @story = Story.find(params[:id])

    respond_to do |format|
      format.json { render json: @story }
    end
  end

=begin
  # GET /stories/new
  def new
    @story = Story.new

    respond_to do |format|
      format.json { render json: @story }
    end
  end

  def edit
    @story = Story.find(params[:id])
  end

  # POST /stories
  def create
    @story = Story.new(params[:story])

    respond_to do |format|
      if @story.save
        format.json { render json: @story, status: :created, location: @story }
      else
        format.json { render json: @story.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /stories/1
  def update
    @story = Story.find(params[:id])

    respond_to do |format|
      if @story.update_attributes(params[:story])
        format.json { head :no_content }
      else
        format.json { render json: @story.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /stories/1
  def destroy
    @story = Story.find(params[:id])
    @story.destroy

    respond_to do |format|
      format.json { head :no_content }
    end
  end

=end
end
