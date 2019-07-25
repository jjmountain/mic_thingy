class AddDurationToRecordings < ActiveRecord::Migration[5.2]
  def change
    add_column :recordings, :duration, :float
  end
end
