var clone = require('clone');


Replacer = function() {};

Replacer.prototype = {
    _lookup: [],
    /**
     * @param {Object} object Any instance.
     * @param {string} keyword The key to replace.
     * @param {*} replacement The replacement of the keyword.
     */
    replace: function(object, keyword, replacement) {
        var original = object[keyword];
        this._lookup.push({instance: object, original: original, lookup: keyword});
        object[keyword] = replacement;
    },
    reset: function() {
        this._lookup.forEach(function(saved) {
            saved.instance[saved.lookup] = saved.original;
        });
        this._lookup = [];
    }
};

var replacer = new Replacer();
/**
 * Wiretap a function call.  Useful when you want to test expected input/ouput of a function.
 * @param {Object} object Any instance.
 * @param {string} keyword The key to wiretap.
 * @param {Function=} opt_replacement A replacement function if any.
 */
Wiretap = function(object, keyword, opt_replacement) {
    this.reset();
    var wiretapped = opt_replacement == undefined ? object[keyword] : opt_replacement;
    var wiretap = this;
    var callback = function() {
        wiretap.callers.push(this);
        wiretap.args_list.push(Array.prototype.slice.call(arguments));
        var ret = wiretapped.apply(this, arguments);
        wiretap.called = wiretap.called + 1;
        wiretap.returns.push(ret);
        return ret;
    };
    replacer.replace(object, keyword, callback);
};

Wiretap.prototype = {
    called: 0,
    args_list: [],
    returns: [],
    callers: [],
    reset: function() {
        this.called = 0;
        this.args_list = [];
        this.returns = [];
        this.callers = [];
    }
};
replacer.Wiretap = Wiretap;
replacer.wiretap = function(object, key, opt_function) {
    return new Wiretap(object, key, opt_function);
};

module.exports = replacer;
