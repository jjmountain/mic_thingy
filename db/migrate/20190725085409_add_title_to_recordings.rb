class AddTitleToRecordings < ActiveRecord::Migration[5.2]
  def change
    add_column :recordings, :title, :string
  end
end
