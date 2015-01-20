var cheerio = require('cheerio');
var CLASS = function(pageBody) {
    var me = this;
    me._$ = null;
    me._pageBody = pageBody;

    me._parseRule = function($ele, rule) {
        var ruleType = typeof(rule);
        if (ruleType == 'string') {
            return $ele.find(rule).text().trim();
        } else if (ruleType == "function") {
            return rule($ele);
        } else if (ruleType === 'object' && rule['PARENT']) {

            var parentRule = rule['PARENT'],
                parents;
            if (typeof(parentRule) === 'string') {
                parents = $ele.find(rule['PARENT']);
            } else if (typeof(parentRule) === 'function') {
                parents = parentRule($ele);
            }

            if (rule['LIST']) {
                var result = [];
                parents.each(function() {
                    result.push(me._parseRule(me._$(this), rule['LIST']));
                });
                return result;
            } else if (rule['OBJECT']) {
                return me._parseRule(parents, rule['OBJECT']);
            }
        } else {
            var result = {};
            for (var key in rule) {
                result[key] = me._parseRule($ele, rule[key]);
            }
            return result;
        }
    };
};

CLASS.prototype.extract = function(rule) {
    this._$ = cheerio.load(this._pageBody);
    return this._parseRule(this._$('html'), rule);
};

module.exports = function(pageBody) {
    return new CLASS(pageBody);
};