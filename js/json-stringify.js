(function() {
	'use strict';

	// Surround string values with double quotes, and escape double quote characters in the string body
	function addQuotes(s) {
		return '"' + s.replace(/\"/g, '\\"') + '"';
	}

	// Create a string using an object's key-value pair
	function kvToString(key, obj) {
		var	objectValue = obj[key],
			tempArray,
			tempKey,
			tempValue;

		// Handle objects with prototype.toJSON() defined (e.g. date objects)
		if(objectValue && typeof objectValue === 'object' && typeof objectValue.toJSON === 'function') {
			objectValue = objectValue.toJSON(key);
		}

		// Create a string based on the object's type
		switch(typeof objectValue) {
			case 'boolean':
				return objectValue.toString();

			case 'number':
				// Ignore infinite numbers
				return isFinite(objectValue) ? objectValue.toString() : null;

			case 'object':
				// Handle the case where value is null (typeof null === 'object')
				if(objectValue === null) {
					return 'null';
				}

				// Handle arrays
				tempArray = [];
				if (objectValue instanceof Array) {
					objectValue.forEach(function(arrayValue, arrayIndex) {
						tempArray.push(kvToString(arrayIndex, objectValue));
					});
					return '[' + tempArray.join(',') + ']';
				}

				// Loop through all keys on the object
				// 
				// NOTE: for...in ignores all non-enumerable properties as required by the spec.
				//       Object.prototype.propertyIsEnumerable() could be manually called, but that
				//       would be redundant.
				for (tempKey in objectValue) {
					if (Object.prototype.hasOwnProperty.call(objectValue, tempKey)) {
						tempValue = kvToString(tempKey, objectValue);
						if (tempValue) {
							tempArray.push(addQuotes(tempKey) + ':' + tempValue);
						}
					}
				}
				return tempArray.length === 0 ? '{}' : '{' + tempArray.join(',') + '}';

			case 'string':
				return addQuotes(objectValue);
		}
	}

	module.exports = {
		jsonStringify: function jsonStringify(value) {
			return kvToString('', {'': value});
		}
	};
}());