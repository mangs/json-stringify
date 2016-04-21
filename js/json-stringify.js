(function() {
	'use strict';

	// Surround string values with double quotes, and escape double quote characters in the string body
	function addQuotes(s) {
		return '"' + s.replace(/\"/g, '\\"') + '"';
	}

	// Create a string using an object's key-value pair
	function kvToString(key, obj) {
		var value = obj[key];

		// Handle objects with prototype.toJSON() defined (e.g. date objects)
		if(value && typeof value === 'object' && typeof value.toJSON === 'function') {
			value = value.toJSON(key);
		}

		// Create a string based on the object's type
		switch(typeof value) {
			case 'boolean':
				return value.toString();

			case 'number':
				// Ignore infinite numbers
				return isFinite(value) ? value.toString() : null;

			case 'object':
				// Handle the case where value is null (typeof null === 'object')
				if(value === null) {
					return 'null';
				}

				// Handle arrays
				let temp = [];
				if(value instanceof Array) {
					value.forEach(function(arrayValue, arrayIndex) {
						temp.push(kvToString(arrayIndex, value));
					});
					return '[' + temp.join(',') + ']';
				}

				// Loop through all keys on the object
				// 
				// NOTE: for...in ignores all non-enumerable properties as required by the spec.
				//       Object.prototype.propertyIsEnumerable() could be manually called, but that
				//       would be redundant.
				for (var k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        var v = kvToString(k, value);
                        if (v) {
                            temp.push(addQuotes(k) + ':' + v);
                        }
                    }
                }
                return temp.length === 0 ? '{}' : '{' + temp.join(',') + '}';

			case 'string':
				return addQuotes(value);
		}
	}

	module.exports.jsonStringify = function jsonStringify(value, replacer, space) {
		return kvToString('', {'': value});
	};
}());