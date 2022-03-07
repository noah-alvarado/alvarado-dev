#!/bin/bash

# build and bundle app
build-app () { yarn run snowpack build; }

case $1 in
  # PROD
  [pP]* )
    while true; do
      read -p "Are you sure you're ready to deploy to production? " yn
      case $yn in
          [Yy]* )
            build-app
            firebase deploy
            break;;
          [Nn]* )
            exit;;
          * )
            echo "Please answer yes or no.";;
      esac
    done
    ;;

  # QA
  [qQ]* )
    build-app
    firebase hosting:channel:deploy preview | grep -o "https://alvarado.dev--preview-.*\.web\.app" | xargs "${BROWSER}";;
  
  * ) echo "Please supply either 'production' or 'qa'";;
esac
