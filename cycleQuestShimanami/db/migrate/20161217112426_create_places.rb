class CreatePlaces < ActiveRecord::Migration[5.0]
  def change
    create_table :places do |t|
      t.string :uuid
      t.integer :red_count
      t.integer :blue_count
      t.integer :green_count

      t.timestamps
    end
  end
end
