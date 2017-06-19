module.exports = class CoverUtils {
	static coverProperties(any) {
		if (typeof any === 'function' &&
			Function.prototype.toString.call(any).indexOf('class') > -1) {
			const proto = any.prototype
			Object.getOwnPropertyNames(proto)
				.filter((p) => p !==
					'constructor').forEach((p) => {

						if (p === 'toJSON') {
							proto.toJSON()
						} else {
							const descriptor =
								Reflect.getOwnPropertyDescriptor(proto, p)
							let setValue =
								Math.random()
							if (descriptor.set) {

								descriptor.set(setValue)
							}
							if (descriptor.get) {
								let getValue =
									descriptor.get()
								if (descriptor.set
									&& setValue !== getValue) {
									throw EvalError(`Property "get ${p}()" didn't equals to "set ${p}()"`)
								}
							}
						}
					})
		}
	}
}
