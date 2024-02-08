export const quickSearchJoiError = {
    "_original": {
      "q": "",
      "pageName": "home"
    },
    "details": [
      {
        "message": "Please enter keywords into the search field.",
        "path": [
          "q"
        ],
        "type": "string.empty",
        "context": {
          "label": "Search Field",
          "value": "",
          "key": "q"
        }
      }
    ],
    "data": {
      "defaultError": {
        "data": null,
        "isBoom": true,
        "isServer": false,
        "output": {
          "statusCode": 400,
          "payload": {
            "statusCode": 400,
            "error": "Bad Request",
            "message": "Invalid request payload input"
          },
          "headers": {}
        }
      }
    },
    "isBoom": true,
    "isServer": false,
    "output": {
      "statusCode": 400,
      "payload": {
        "statusCode": 400,
        "error": "Bad Request",
        "message": "Please enter keywords into the search field.",
        "validation": {
          "source": "payload",
          "keys": [
            "q"
          ]
        }
      },
      "headers": {}
    }
  }