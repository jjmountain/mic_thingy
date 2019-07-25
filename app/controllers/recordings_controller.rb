class RecordingsController < ApplicationController

  def index
    @recordings = policy_scope(Recording)
  end

  def new
    @recording = Recording.new
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

  private

  def recording_params
    params.require(:recording).permit(:url, :user_id)
  end
end
