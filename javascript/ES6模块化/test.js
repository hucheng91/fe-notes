function once(fn, context) {
	var result
	return function() {
		if(fn) {
			result = fn.apply(context || this, arguments)
			fn = null
		}
		return result
	}
}

// Exported
export function first (arr) {
  return arr[0]
}

// Exported
export function last (arr) {
  return arr[arr.length - 1]
}