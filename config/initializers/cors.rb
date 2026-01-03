Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      origins "http://localhost:3000", "http://localhost"  # change to your React domain in production
      resource "*",
        headers: :any,
        methods: [:get, :post, :put, :patch, :delete, :options]
    end
  end  