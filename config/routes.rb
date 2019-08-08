Rails.application.routes.draw do
  devise_for :users do 
  end
  
  root to: 'pages#home'

  get 'recordings', to: 'recordings#index'
  get 'recordings/new', to: 'recordings#new'
  post 'recordings', to: 'recordings#create'
  get 'recordings/:id', to: 'recordings#show'
  patch 'recordings/:id', to: 'recordings#update'

  # resources :recordings, only: [:index, :new, :create]
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
