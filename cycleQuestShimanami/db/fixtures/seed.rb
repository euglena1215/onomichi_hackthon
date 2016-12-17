require "csv"

# SeedFu.quiet = true

CSV.foreach('db/fixtures/uuid.csv') do |row|
  Place.seed do |p|
    p.uuid = row[0]
    p.red_count = 0
    p.blue_count = 0
    p.green_count = 0
  end
end