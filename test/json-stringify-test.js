'use strict';

let expect = require('chai').expect;
let jsonStringify = require('../js/json-stringify').jsonStringify;

// Using all relevant examples from the Mozilla Developer Network page for JSON.stringify()
// (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
// in addition to some custom tests I came up with myself.

// NOTE: due to time constraints, I wasn't able to implement parameters 2 and 3 for JSON.stringify()
describe('Eric Goldstein\'s JSON.stringify() clone', function() {
	it('handles undefined', function() {
		expect(jsonStringify(undefined)).to.equal(undefined);
		expect(jsonStringify()).to.equal(undefined);
	});

	it('handles primitive data types Boolean, Number, and String', function() {
		expect(jsonStringify(false)).to.equal('false');
		expect(jsonStringify(35)).to.equal('35');
		expect(jsonStringify('test string')).to.equal('"test string"');
		expect(jsonStringify('one "two" three')).to.equal('"one \\"two\\" three"');
	});

	it('handles dates', function() {
		expect(jsonStringify(new Date(Date.UTC(2006, 0, 2, 15, 4, 5)))).to.equal('"2006-01-02T15:04:05.000Z"');
		expect(jsonStringify(new Date(Date.UTC(1982, 9, 9)))).to.equal('"1982-10-09T00:00:00.000Z"'); // My birfday!
	});

	it('handles objects', function() {
		expect(jsonStringify(null)).to.equal('null');
		expect(jsonStringify({})).to.deep.equal('{}');
		expect(jsonStringify({x:5})).to.deep.equal('{"x":5}');
		expect(jsonStringify({ x: 5, y: 6 })).to.deep.equal('{"x":5,"y":6}');
	});

	it('handles arrays', function() {
		expect(jsonStringify([1, 'false', false])).to.deep.equal('[1,"false",false]');
	})

	it('handles non-enumerable properties', function() {
		expect(jsonStringify(Object.create(null, { x: { value: 'x', enumerable: false }, y: { value: 'y', enumerable: true } }) ))
			.to.deep.equal('{"y":"y"}');
	});

	it('handles a complex combination of objects, arrays, and primitive values', function() {
		const testObject = {
			people: ['jim', 'bob', 'fred'],
			count: 3,
			rolesAvailable: true,
			contacts: [{name: 'Fake Guy', email: 'fake@guy.com'}, {name: 'Someone Else', email: 'someone@else.com'}]
		};
		const expected = '{"people":["jim","bob","fred"],"count":3,"rolesAvailable":true,"contacts":[{"name":"Fake Guy","email":"fake@guy.com"},{"name":"Someone Else","email":"someone@else.com"}]}';
		expect(jsonStringify(testObject)).to.deep.equal(expected);
	})
});