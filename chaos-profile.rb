require 'sinatra'
require 'sinatra/reloader' if development?
require 'sinatra/json'
require 'dm-core'
require 'dm-redis-adapter'
require 'dm-serializer'
require "dm-validations"
require "dm-validations-i18n"
require 'json'

Redis.current = Redis.new(host: 'localhost', port: 6379)
DataMapper.setup(:default, {adapter: "redis"})

get '/' do
  send_file File.join(settings.public_folder, 'index.html')
end

get '/p/*name' do
  name = params['name']
  raise Sinatra::NotFound unless name.nil? || name.empty?
  begin
    person = Person.get!(name)
  rescue ObjectNotFoundError
    halt 404
  end
  person.to_json(methods: [])
end

get '/q' do
  Question.all.to_json
end

get '/q/:id' do
  id = params['id']
  begin
    question = Question.get!(id)
  rescue ObjectNotFoundError
    halt 404
  end
  question.to_json
end

post '/q' do
  payload = JSON.parse(request.body.read)
  now = Time.now
  question = Question.create(question: payload['question'], only_to: payload['only_to'], person: payload['person'], created_at: now, updated_at: now)
  halt 400 unless question.errors.empty?
  redirect "/q/#{question.id}"
end

put '/q/:id' do
  payload = JSON.parse(request.body.read)
  id = payload['id']
  begin
    question = Question.get!(id)
  rescue ObjectNotFoundError
    halt 404
  end
  question.question = payload['question']
  question.only_to = payload['only_to']
  question.person = payload['person']
  question.updated_at = Time.now
  question.save
  halt 400 unless test.errors.empty?
  redirect "/q/#{question.id}"
end

post '/a' do |path|
  send_file File.join(settings.public_folder, 'index.html')
end

class Person
  include DataMapper::Resource
  property :name, String, key: true, index: true, required: true
  property :description, Text
  has n, :answers
  property :created_at, Time
  property :updated_at, Time
  has n, :questions, through: :question_to_person
end

class Question
  include DataMapper::Resource
  property :id, Serial
  property :question, Text
  property :only_to, Boolean
  property :created_at, Time
  property :updated_at, Time
  has n, :answers
  has n, :persons, through: :question_to_person
end

class QuestionToPerson
  include DataMapper::Resource
  property :id, Serial
  belongs_to :question
  belongs_to :person
end

class Answer
  include DataMapper::Resource
  property :id, Serial
  property :answer, Text
  property :created_at, Time
  property :updated_at, Time
  belongs_to :person
  belongs_to :question
end

DataMapper.finalize
DataMapper::Validations::I18n.localize! 'ja'
