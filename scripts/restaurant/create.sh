#!/bin/bash

API="http://localhost:4741"
URL_PATH="/restaurants"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer ${TOKEN}" \
  --data '{
    "restaurant": {
      "name": "'"${NAME}"'",
      "description": "'"${DESC}"'",
      "general_location": "'"${LOCATION}"'",
      "website": "'"${SITE}"'"
    }
  }'

echo
