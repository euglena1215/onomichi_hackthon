class PlacesController < ApplicationController
  before_action :set_place, only: [:show, :edit, :update, :destroy]

  # GET /places
  # GET /places.json
  def index
    @places = Place.all
  end

  # GET /places/1
  # GET /places/1.json
  def show
  end

  # GET /places/new
  def new
    @place = Place.new
  end

  # GET /places/1/edit
  def edit
  end

  # POST /places
  # POST /places.json
  def create
    @place = Place.new(place_params)

    respond_to do |format|
      if @place.save
        format.html { redirect_to @place, notice: 'Place was successfully created.' }
        format.json { render :show, status: :created, location: @place }
      else
        format.html { render :new }
        format.json { render json: @place.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /places/1
  # PATCH/PUT /places/1.json
  def update
    respond_to do |format|
      if @place.update(place_params)
        format.html { redirect_to @place, notice: 'Place was successfully updated.' }
        format.json { render :show, status: :ok, location: @place }
      else
        format.html { render :edit }
        format.json { render json: @place.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /places/1
  # DELETE /places/1.json
  def destroy
    @place.destroy
    respond_to do |format|
      format.html { redirect_to places_url, notice: 'Place was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def api
    place = Place.find_by(uuid: params[:uuid])
    render text: "{\"red\": \"#{place.red_count}\", \"blue\": \"#{place.blue_count}\", \"green\": \"#{place.green_count}\"}"
  end

  def api2
    place = Place.find_by(uuid: params[:uuid])
    group_name = params[:group]

    case group_name
    when 'red' then
      if place.update_attribute(:red_count, place.red_count+1)
        render text: 'success'
      else
        render text: 'failure'
      end
    when 'blue' then
      if place.update_attribute(:blue_count, place.blue_count+1)
        render text: 'success'
      else
        render text: 'failure'
      end
    when 'green' then
      if place.update_attribute(:green_count, place.green_count+1)
        render text: 'success'
      else
        render text: 'failure'
      end
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_place
      @place = Place.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def place_params
      params.require(:place).permit(:uuid, :red_count, :blue_count, :green_count)
    end
end
