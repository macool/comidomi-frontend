module.exports = {
  deploy : {
    demo : {
      user : "macool",
      host : "demo.moviggo.com",
      ref  : "origin/production",
      repo : "git@github.com:noggalito/porttare-frontend.git",
      path : "~/demo-porttare-frontend",
      "post-deploy" : "export PATH=~/.nvm/versions/v0.12.14/bin:~/.rbenv/shims:$PATH && " +
                      "npm install && " +
                      "NODE_ENV=demo ./node_modules/grunt-cli/bin/grunt compress && " +
                      "pm2 startOrRestart ~/demo-porttare-frontend/shared/ecosystem.json && " +
                      "touch ~/demo-porttare-frontend/current/www/cordova.js"
    }
  }
}
