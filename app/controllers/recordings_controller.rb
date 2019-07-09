class RecordingsController < ApplicationController

  def index
    @recordings = policy_scope(Recording)
  end
end
