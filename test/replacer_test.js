var chai = require('chai');
var expect = chai.expect;
var Replacer = require('../index');

describe('Replacer', function replacerTest() {
    var Foo = function() {

    };
    Foo.prototype = {
        bar: function() { return 4; },
        baz: 5
    };
    it('should replace and reset properties', function(done) {
        var x = new Foo();
        expect(x.bar()).to.equal(4);
        expect(x.baz).to.equal(5);
        
        expect(x.bar()).to.equal(4);
        Replacer.replace(Foo.prototype, 'bar', function() { return 42; });
        expect(x.bar()).to.equal(42);

        Replacer.replace(Foo.prototype, 'baz', 365);

        var y = new Foo();
        expect(y.bar()).to.equal(42);
        expect(y.baz).to.equal(365);
        expect(x.baz).to.equal(365);

        Replacer.reset();
        expect(x.bar()).to.equal(4);
        expect(x.baz).to.equal(5);
        expect(y.bar()).to.equal(4);
        expect(y.baz).to.equal(5);

        Replacer.replace(y, 'bar', function() { return 'hi'; });
        Replacer.replace(y, 'baz', 'there');
        expect(x.bar()).to.equal(4);
        expect(x.baz).to.equal(5);
        expect(y.bar()).to.equal('hi');
        expect(y.baz).to.equal('there');

        Replacer.reset();
        expect(x.bar()).to.equal(4);
        expect(x.baz).to.equal(5);
        expect(y.bar()).to.equal(4);
        expect(y.baz).to.equal(5);

        done();
    });
    it('should wiretap input and output of a function', function(done) {
        var Dog = function(name) { this.name = name; };
        var Cat = function(name) { this.name = name; };
        Cat.prototype = {
            getName: function() { return this.name; },
            meow: function(adverb) { return this.getName() + ' meows ' + adverb; }
        };
        var wt_getName = Replacer.wiretap(Cat.prototype, 'getName');

        var cat = new Cat('Mr. Pickles');
        var name = cat.getName();
        expect(name).to.equal('Mr. Pickles');
        expect(wt_getName.returns[0]).to.equal('Mr. Pickles');
        expect(wt_getName.args_list[0]).deep.equal([]);
        expect(wt_getName.called).to.equal(1);
        expect(wt_getName.callers[0]).to.equal(cat);
        

        name = cat.getName(1,2,3,4);
        expect(name).to.equal('Mr. Pickles');
        expect(wt_getName.returns[1]).to.eql('Mr. Pickles');
        expect(wt_getName.called).to.equal(2);
        expect(wt_getName.args_list[1]).deep.equal([1,2,3,4]);
        expect(wt_getName.callers[1]).to.equal(cat);

        wt_getName.reset();
        var dog = new Dog('Sparky');
        name = Cat.prototype.getName.call(dog);
        expect(name).to.equal('Sparky');
        expect(wt_getName.returns[0]).to.eql('Sparky');
        expect(wt_getName.called).to.equal(1);
        expect(wt_getName.args_list[0]).deep.equal([]);
        expect(wt_getName.callers[0]).to.equal(dog); // the dog called the Cat method!
        wt_getName.reset();

        var meow = cat.meow('sleepily');
        expect(meow).to.equal('Mr. Pickles meows sleepily');
        expect(wt_getName.returns[0]).to.equal('Mr. Pickles');
        expect(wt_getName.args_list[0]).deep.equal([]);
        expect(wt_getName.called).to.equal(1);
        expect(wt_getName.callers[0]).to.equal(cat);

        done();        
    });
    it('can wiretap and replace at the same time', function(done) {
        var Bell = function(){};
        Bell.prototype.ring = function() { return 'Ding!'; };
        
        var bell = new Bell();
        var wt_ring = Replacer.wiretap(Bell.prototype, 'ring', function() { return 'Dong!'; });
        var ring = bell.ring();
        expect(ring).to.equal('Dong!');
        expect(wt_ring.returns[0]).to.equal('Dong!');
        expect(wt_ring.args_list[0]).deep.equal([]);
        expect(wt_ring.called).to.equal(1);
        expect(wt_ring.callers[0]).to.equal(bell);
        
        done();
        
    });
});
