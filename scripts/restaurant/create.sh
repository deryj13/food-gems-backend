#!/bin/bash

API="http://localhost:4741"
URL_PATH="/restaurants"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{
    "restaurant": {
      "name": "'"${NAME}"'",
      "description": "'"${DES}"'",
      "general_location": "'"${LOCATION}"'",
      "website": "'"${SITE}"'"
    }
  }'

echo
