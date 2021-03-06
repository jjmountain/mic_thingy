class RecordingsController < ApplicationController

  def index
    @recordings = policy_scope(Recording).order(:created_at).page(params[:page]).per(5)
  end

  def new
    @recording = Recording.new
    authorize @recording
  end

  def show
    @recording = Recording.find(params[:id])
    authorize @recording
  end

  def create
    @recording = Recording.new(recording_params)
    @recording.user_id = current_user.id
    authorize @recording
    if @recording.save!
      redirect_to recordings_path
    else
    end
  end

  def update
    
  end

  def destroy
    @recording = Recording.find(params[:id])
    authorize @recording
    @recording.destroy
    @recording.url.file.delete
    redirect_to recordings_path
  end

  private

  def recording_params
    params.require(:recording).permit(:url, :user_id, :duration, :title)
  end
end
