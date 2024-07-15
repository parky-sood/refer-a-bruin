#!/bin/bash


#need to make sure that this only affects the front-end server because the back end only works on 3001 

# PID=$(lsof -t -i:3000)
# if [ -n "$PID" ]; then
#     echo "Front-end server is already running on port 3000. Killing process..."
#     kill -9 $PID
# fi

# Install firebase and firebase-admin
npm install firebase
npm install firebase-admin --save

# Install npm-run-all
npm install npm-run-all --save-dev


# Run front-end and back-end
npx npm-run-all --parallel start:back-end start:front-end

