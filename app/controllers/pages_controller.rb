class PagesController < ApplicationController
  skip_before_action :authenticate_user!, only: [:landing]

  def landing
    @transparent_navbar = true
  end

  def home

  end
end
