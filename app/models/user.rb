class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  has_many :recordings, dependent: :destroy
  mount_uploader :photo, PhotoUploader
  validates :name, presence: true
  validates :teacher, inclusion: { in: [true, false] }
end
