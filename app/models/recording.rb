class Recording < ApplicationRecord
  belongs_to :user
  mount_uploader :url, AudioUploader
  validates :url, presence: true
end
