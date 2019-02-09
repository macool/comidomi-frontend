# config valid only for current version of Capistrano
lock "3.7.1"

set :keep_releases, 3
set :application, "porttare-frontend"
set :repo_url, 'git@github.com:vilcabamba/porttare-frontend.git'

set :npm_flags, '--silent --no-progress'
set :npm_env_variables, path: "#{fetch(:rbenv_path)}/shims:$PATH"

set :slackistrano, {
  channel: '#porttare',
  webhook: 'https://hooks.slack.com/services/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'
}

set :rbenv_ruby, '2.3.0'

# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp
set :branch, ENV['BRANCH'] || 'production'

# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, "/var/www/my_app_name"

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# append :linked_files, "config/database.yml", "config/secrets.yml"
append :linked_files, '.env'

# Default value for linked_dirs is []
# append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"
append :linked_dirs, 'log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'vendor/bundle', 'public/system', 'public/uploads', 'node_modules', 'app/bower_components'

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for keep_releases is 5
# set :keep_releases, 5
namespace :deploy do
  desc 'build'
  task :build do
    invoke 'porttare:build'
  end

  after :publishing, :build
end
