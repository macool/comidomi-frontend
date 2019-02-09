namespace :porttare do
  desc 'build app'
  task :build do
    on roles(:app) do
      # execute 'NODE_ENV=demo ./node_modules/grunt-cli/bin/grunt compress'
      npm_path = fetch(:npm_target_path, release_path)
      nvm_path = fetch(:nvm_node_path).map{|d| "#{d}/bin"}.join(":")
      rbenv_path = fetch(:rbenv_path) + "/shims"
      within npm_path do
        with node_env: fetch(:stage), path: "#{nvm_path}:#{rbenv_path}:$PATH" do
          SSHKit.config.command_map[:grunt] = "./node_modules/grunt-cli/bin/grunt"
          execute :grunt, :compress
          execute :touch, 'www/cordova.js'
        end
      end
    end
  end
end
