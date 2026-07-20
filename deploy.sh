#!/bin/bash

# deployment prerequisites
acceptance-tests () {
  bun run lint:fix
  bun audit
  # TODO: run unit tests
  # TODO: run integration tests
}

# build and bundle app
build-app () { bun run build; }

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
    firebase hosting:channel:deploy preview
    ;;
  
  * )
    echo "Please supply either 'production' or 'qa'";;
esac
