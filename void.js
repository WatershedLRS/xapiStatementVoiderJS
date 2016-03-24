var lrs;
var statements = [];
try {
    lrs = new TinCan.LRS(
        {
            endpoint: config.endpoint,
            username: config.key,
            password: config.secret,
            allowFail: false,
            version: '1.0.0'
        }
    );
}
catch (ex) {
    console.log("Failed to setup LRS object: " + ex);
}

var params = trimNulls(config.lrsFilter);
console.log (params);

if (params.hasOwnProperty('agent')){
    params.agent = new TinCan.Agent(params.agent);
}

lrs.queryStatements(
    {
        params: params,
        callback: fetchStatementsCallback
    }
);

function trimNulls(obj){
    for (var i in obj) {
        if (obj[i] === null) {
            delete obj[i];
        }
        // Recursion
        else if (typeof obj[i] === 'object') {
            obj[i] = trimNulls(obj[i]);
        }
        else if (typeof obj[i] === 'array') {
            var j;
            for (j = 0; j < obj[i].length; ++j) {
                obj[i][j] = trimNulls(obj[i][j]);
            }
        }
    }

    return obj;
}

function getStatmentProperty(value, filterStr){

    var filter = filterStr.split('.');
    while (filter.length > 0) {
        value = value[filter[0]];
        filter.shift();
    }
    return value;
}

function fetchStatementsCallback (err, sr) {
    console.log('fetched statements');
    if (err !== null) {
        console.log("Failed to query statements: " + err);
        console.log(sr)
        return;
    }

    statements = statements.concat(sr.statements);

    if (sr.more == null) {
        processStatements();
    }
    else {
        lrs.queryStatements(
            {
                url: sr.mmore,
                callback: fetchStatementsCallback
            }
        );
    }
}

function processStatements(){
    console.log('processing statements');

    var statementsToVoid = [];

    var statementIndex,
    statementsLength = statements.length;
    for (statementIndex = 0; statementIndex < statementsLength; ++statementIndex) {
        // Ignore existing 'voiding' statements 
        if (statements[statementIndex].verb.id === 'http://adlnet.gov/expapi/verbs/voided') {
            statements = statements.splice(statementIndex, 1);
            break;
        }
        var match = true;
        for (var filterStr in config.additionalFilter) {
            if (config.additionalFilter.hasOwnProperty(filterStr)) {
                if (getStatmentProperty(statements[statementIndex], filterStr) !== config.additionalFilter[filterStr]) {
                    match = false;
                }
            }
        }
        if (match == true){
            statementsToVoid.push(statements[statementIndex].id);
        }
    }
    console.log('Statements returned:');
    console.log(statements);
    console.log('Statement ids voided:');
    console.log(statementsToVoid);

    // Send voided statements to LRS
    var voidingStatements = [];
    for (var voidIndex = statementsToVoid.length - 1; voidIndex >= 0; voidIndex--) {
        var voidingStatement = new TinCan.Statement({
            'actor': config.actor,
            'verb': {'id':'http://adlnet.gov/expapi/verbs/voided'},
            'object': {
                'objectType': 'StatementRef',
                'id': statementsToVoid[voidIndex]
            }
        });
        voidingStatements.push(voidingStatement);
    }

    var result = lrs.saveStatements(voidingStatements);
    if (result.err !== null) {
        if (/^\d+$/.test(result.err)) {
            if (result.err === 0) {
                console.log("Failed to save voiding statements: aborted, offline, or invalid CORS endpoint");
            }
            else {
                console.log("Failed to save voiding statements: " + result.xhr.responseText);
            }
        }
        else {
            console.log("Failed to save voiding statements: " + result.err);
        }
    }
    else {
        console.log("Voiding statements saved");
    }
}
