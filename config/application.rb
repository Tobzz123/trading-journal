require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module TradingJournal
  class Application < Rails::Application
    config.load_defaults 8.1
    config.api_only = true
  end
end
