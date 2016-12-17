Rails.application.routes.draw do
  root 'groups#index'
  resources :places
  resources :groups
  get 'api', to: 'places#api'
  get 'api2', to: 'places#api2'
end
