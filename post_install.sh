#!/bin/bash
gem install bundler -N --conservative
bundle check --path=vendor/bundle || bundle install --path=vendor/bundle --jobs=4 --retry=3
./node_modules/bower/bin/bower install

# build if there's a Gruntfile for
# this environment. Currently used
# to compress on staging deployment
GRUNTFILE="Gruntfile.$ENVIRONMENT.js"
if [ -e "$GRUNTFILE" ]
then
  ./node_modules/grunt-cli/bin/grunt --gruntfile $GRUNTFILE build
fi

exit $?
