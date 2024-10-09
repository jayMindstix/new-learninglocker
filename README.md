[![Learning Locker Logo](https://i.imgur.com/hP1yFKL.png)](http://learninglocker.net)
> An open source Learning Record Store (LRS) implementing the [xAPI](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI.md) ([Tin Can API](http://tincanapi.com/)).

[![Build Status](https://travis-ci.org/LearningLocker/learninglocker.svg?branch=master)](https://travis-ci.org/LearningLocker/learninglocker)
[![License](https://poser.pugx.org/learninglocker/learninglocker/license.svg)](http://opensource.org/licenses/GPL-3.0)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/LearningLocker/learninglocker?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

*Learning Locker is copyright [Learning Pool](https://learningpool.com/)*

Please see our [documentation](http://docs.learninglocker.net) for installation, configuration, and usage instructions.

You can also [register your Learning Locker](https://learningpool.com/register-locker) or get [Learning Locker Data Cloud](https://learningpool.com/solutions/learning-record-store-learning-locker).

# Learning locker Confluence 
https://learninglocker.atlassian.net/wiki/spaces/DOCS/pages/106102785/Custom+Installation

# Install package.json node modules
npm_config_build_from_source=true yarn install --ignore-engines

# Build Repo
Debug/Dev mode - yarn build-all-dev
Production mode - yarn build-all

# Run command
> Individual run
  node ui/dist/server
  node api/dist/server
  node worker/dist/server

> Via pm2 (run all together)
  Dev mode 
    - npm run start
    - npm run stop
  Prod mode 
    - npm run start-dev
    - npm run stop-dev

# Fixes

5th Oct 2024 (Saturday)
> ReferenceError: require is not defined in ES module scope
  - Comment out nodeExternals() from webpack configuration

7th Oct 2024 (Monday)
> Issue with "US/Pacific-New" timezone for moment package
  - Removed "US/Pacific-New" timezone from the array as per https://github.com/moment/moment-timezone/issues/903

> Redux Reducer issue for not assigning default state
  - Added initialState to the all handleAction methods

8th Oct 2024 (Tuesday)
> Can't resolve hiredis npm package in @learninglocker/xapi-statements
  - Forcefully upgrade the parent package (ioredis) that has been using in @learninglocker/xapi-statements package

9th Oct 2024 (Wednesday)
> Unexpected strict mode reserved word (interface)
  - Commented pkgcloud package code that was causing the issue

> Load core.css on UI render

> Added fixes based on the upgraded node packages