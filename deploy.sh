#!/bin/bash

# deployment prerequisites
acceptance-tests () {
  yarn lint:fix
  yarn audit
  # TODO: run unit tests
  # TODO: run integration tests
}

# build and bundle app
build-app () { yarn build; }

case $1 in
  # PROD
  [pP]* )
    while true; do
      read -p "Are you sure you're ready to deploy to production? " yn
      case $yn in
          [Yy]* )
            acceptance-tests
            build-app
            firebase login
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
    acceptance-tests
    build-app
    firebase login
    output=$(firebase hosting:channel:deploy preview 2>&1)
    status=$?
    if [ $status -ne 0 ]; then
      echo "Firebase deploy failed with output:"
      echo "$output"
      exit $status
    else
      echo "$output" | grep -o "https://alvarado.dev--preview-.*\\.web\\.app"
    fi
    ;;
  
  * ) echo "Please supply either 'production' or 'qa'";;
esac
