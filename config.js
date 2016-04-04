var config = {
    'endpoint': 'https://lrs.example.com',
    'key': 'key',
    'secret': 'secret',
    'actor': {'mbox': 'mailto:voidtool@example.com'},
    'lrsFilter': {
        'statementId': null,
        'agent': null,
        'verb': null,
        'activity': null,
        'registration': null,
        'related_activities': false,
        'related_agents': false,
        'since': null,
        'until': null,
        'format': 'ids', // There is no need to change this
        'ascending': true
    },
    'additionalFilter': {}
};

/* TEMPLATE CONFIG

var config = {
    'endpoint': 'https://lrs.example.com',
    'key': 'key',
    'secret': 'secret',
    'actor': {'mbox': 'mailto:voidtool@example.com'},
    'lrsFilter': {
        'statementId': null,
        'agent': null,
        'verb': null,
        'activity': null,
        'registration': null,
        'related_activities': false,
        'related_agents': false,
        'since': null,
        'until': null,
        'format': 'ids', // There is no need to change this
        'ascending': true
    },
    'additionalFilter': {}
};

*/

/* EXAMPLE CONFIG

var config = {
    'endpoint': 'https://sandbox.watershedlrs.com/api/organizations/3211/lrs/',
    'key': 'ZZRIQwyXBEULpE',
    'secret': 'ViCeILKtMEB0K1',
    'actor': {'mbox': 'mailto:voidtool@watershedlrs.com'},
    'lrsFilter': {
        'statementId': null,
        'agent': {
            'account': {
                'homePage': 'https://sandbox.watershedlrs.com',
                'name': 'ZZRIQwyXBEULpE'
            }
        },
        'verb': null,
        'activity': null,
        'registration': null,
        'related_activities': false,
        'related_agents': true,
        'since': null,
        'until': null,
        'format': 'ids', // There is no need to change this
        'ascending': true
    },
    'additionalFilter': {
        'authority.account.name': 'ZZRIQwyXBEULpE',
        'authority.account.homePage': 'https://sandbox.watershedlrs.com'
     }
};

*/