export const dateQuestionChronologicalJoiError = {
    "_original": {
        "from-date-day": "1",
        "from-date-month": "5",
        "from-date-year": "2023",
        "to-date-day": "1",
        "to-date-month": "1",
        "to-date-year": "2023"
    },
    "details": [
        {
            "message": "The dates must be in chronological order",
            "path": [
                "to-date-year"
            ],
            "type": "any.custom",
            "context": {
                "errors": [
                    "to-date-day",
                    "to-date-month",
                    "to-date-year",
                    "from-date-day",
                    "from-date-month",
                    "from-date-year"
                ],
                "label": "to-date-year",
                "value": 2023,
                "key": "to-date-year"
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
            "message": "The dates must be in chronological order",
            "validation": {
                "source": "payload",
                "keys": [
                    "to-date-year"
                ]
            }
        },
        "headers": {}
    }
}

export const dateQuestionChronologicalError = {
    "fromError": "   The dates must be in chronological order.",
    "fromItems": [
        {
            "classes": "govuk-input--width-2 govuk-input--error",
            "name": "day",
            "value": "1"
        },
        {
            "classes": "govuk-input--width-2 govuk-input--error",
            "name": "month",
            "value": "5"
        },
        {
            "classes": "govuk-input--width-4 govuk-input--error",
            "name": "year",
            "value": "2023"
        }
    ],
    "toError": "   The dates must be in chronological order.",
    "toItems": [
        {
            "classes": "govuk-input--width-2 govuk-input--error",
            "name": "day",
            "value": "1"
        },
        {
            "classes": "govuk-input--width-2 govuk-input--error",
            "name": "month",
            "value": "1"
        },
        {
            "classes": "govuk-input--width-4 govuk-input--error",
            "name": "year",
            "value": "2023"
        }
    ]
}

export const dateQuestionnaireGovUKError = {
    "fromDate": {
        "errorMessage": {
            "text": "   The dates must be in chronological order.",
        },
        "fieldset": {
            "legend": {
                "text": "You must enter a year, for example, 2007",
            },
        },
        "hint": {
            "text": "You can choose to enter a day or month, for example, 27 3 2007",
        },
        "id": "from-date",
        "items": [
            {
                "classes": "govuk-input--width-2 govuk-input--error",
                "name": "day",
                "value": "1",
            },
            {
                "classes": "govuk-input--width-2 govuk-input--error",
                "name": "month",
                "value": "5",
            },
            {
                "classes": "govuk-input--width-4 govuk-input--error",
                "name": "year",
                "value": "2023",
            },
        ],
        "name": "from-date",
        "namePrefix": "from-date",
    },
    "toDate": {
        "errorMessage": {
            "text": "   The dates must be in chronological order.",
        },
        "fieldset": {
            "legend": {
                "text": "You must enter a year, for example, 2007",
            },
        },
        "hint": {
            "text": "You can choose to enter a day or month, for example, 27 3 2007",
        },
        "id": "to-date",
        "items": [
            {
                "classes": "govuk-input--width-2 govuk-input--error",
                "name": "day",
                "value": "1",
            },
            {
                "classes": "govuk-input--width-2 govuk-input--error",
                "name": "month",
                "value": "1",
            },
            {
                "classes": "govuk-input--width-4 govuk-input--error",
                "name": "year",
                "value": "2023",
            },
        ],
        "name": "to-date",
        "namePrefix": "to-date",
    },
}