Rails.application.routes.draw do
  devise_for :users
  root to: 'pages#home'

  get 'recordings', to: 'recordings#index'
  get 'recordings/new', to: 'recordings#new'
  post 'recordings', to: 'recordings#create'

  # resources :recordings, only: [:index, :new, :create]
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
