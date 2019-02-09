# porttare-frontend

[![CircleCI](https://circleci.com/gh/vilcabamba/porttare-frontend/tree/master.svg?style=svg)](https://circleci.com/gh/vilcabamba/porttare-frontend/tree/master)
[![Code Climate](https://codeclimate.com/github/vilcabamba/porttare-frontend/badges/gpa.svg)](https://codeclimate.com/github/vilcabamba/porttare-frontend)

### requirements

- ruby (>=2.1)
- nodejs (>=0.12.0 <=5.0.0)

### getting started

- `git clone https://github.com/vilcabamba/porttare-frontend.git`
- `npm install -g cordova grunt grunt-cli bower`
- `cd porttare-frontend`
- `npm install && bower install`

### commands

- Start Server `grunt serve`
- Run tests `grunt test`
- Run tests and create coverage report `grunt karma`

### angular translate

For translations, we're using [angular-translate](https://angular-translate.github.io/).
You need to add translations in app/scripts/config/translations-config.js, then you can use them in templates.
templates/login/login.jade has an usage example.

### deployment

- `npm install -g pm2`
- `./deploy.bash demo`
