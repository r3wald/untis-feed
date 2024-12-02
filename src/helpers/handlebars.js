const moment = require('moment');

module.exports = {
    formatDate: (date, helper) => {
        moment.locale('de-de');
        return moment(date).format('LL');
    },
    formatTime: (date, helper) => {
        moment.locale('de-de');
        return moment(date).format('TS');
    },
    formatDateTime: (date, options) => {
        // helper.name -> 'formatDateTime'
        // helper.data.exphbs.view -> 'home'
        // helper.data.exphbs.data -> express-handlebars instance
        // console.log(this.name, date, options, Handlebars.escapeExpression(options.hash.foo));
        moment.locale('de-de');
        return moment(date).format('LLL');
    },
    'ifCond': (v1, operator, v2, options) => {

        switch (operator) {
            case '==':
                return (v1 == v2) ? options.fn(this) : options.inverse(this);
            case '===':
                return (v1 === v2) ? options.fn(this) : options.inverse(this);
            case '!=':
                return (v1 != v2) ? options.fn(this) : options.inverse(this);
            case '!==':
                return (v1 !== v2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (v1 < v2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (v1 <= v2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (v1 > v2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (v1 >= v2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (v1 && v2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (v1 || v2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }
    }
};
