Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      if Rails.env.development?
        origins "http://localhost:3000", "http://localhost:3001"
      else
        origins ENV.fetch("CORS_ORIGIN")
      end
      resource "*",
        headers: :any,
        methods: [:get, :post, :put, :patch, :delete, :options],
        credentials: true
    end
  end  