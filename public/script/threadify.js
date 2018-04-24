!(function(a) {
	if ('object' == typeof exports && 'undefined' != typeof module)
		module.exports = a()
	else if ('function' == typeof define && define.amd) define([], a)
	else {
		var b
		;(b =
			'undefined' != typeof window
				? window
				: 'undefined' != typeof global
					? global
					: 'undefined' != typeof self
						? self
						: this),
			(b.threadify = a())
	}
})(function() {
	return (function a(b, c, d) {
		function e(g, h) {
			if (!c[g]) {
				if (!b[g]) {
					var i = 'function' == typeof require && require
					if (!h && i) return i(g, !0)
					if (f) return f(g, !0)
					var j = new Error("Cannot find module '" + g + "'")
					throw ((j.code = 'MODULE_NOT_FOUND'), j)
				}
				var k = (c[g] = { exports: {} })
				b[g][0].call(
					k.exports,
					function(a) {
						var c = b[g][1][a]
						return e(c || a)
					},
					k,
					k.exports,
					a,
					b,
					c,
					d
				)
			}
			return c[g].exports
		}
		for (
			var f = 'function' == typeof require && require, g = 0;
			g < d.length;
			g++
		)
			e(d[g])
		return e
	})(
		{
			1: [
				function(a, b, c) {
					;(function(a) {
						b.exports = {
							serializeArgs: function(b) {
								'use strict'
								for (
									var c = [
											'Int8Array',
											'Uint8Array',
											'Uint8ClampedArray',
											'Int16Array',
											'Uint16Array',
											'Int32Array',
											'Uint32Array',
											'Float32Array',
											'Float64Array'
										],
										d = [],
										e = [],
										f = 0;
									f < b.length;
									f++
								)
									if (b[f] instanceof Error) {
										for (
											var g = {
													type: 'Error',
													value: { name: b[f].name }
												},
												h = Object.getOwnPropertyNames(
													b[f]
												),
												i = 0;
											i < h.length;
											i++
										)
											g.value[h[i]] = b[f][h[i]]
										d.push(g)
									} else if (b[f] instanceof DataView)
										e.push(b[f].buffer),
											d.push({
												type: 'DataView',
												value: b[f].buffer
											})
									else {
										if (b[f] instanceof ArrayBuffer)
											e.push(b[f])
										else if (
											'ImageData' in a &&
											b[f] instanceof ImageData
										)
											e.push(b[f].data.buffer)
										else
											for (var j = 0; j < c.length; j++)
												if (b[f] instanceof a[c[j]]) {
													e.push(b[f].buffer)
													break
												}
										d.push({ type: 'arg', value: b[f] })
									}
								return { args: d, transferable: e }
							},
							unserializeArgs: function(a) {
								'use strict'
								for (var b = [], c = 0; c < a.length; c++)
									switch (a[c].type) {
										case 'arg':
											b.push(a[c].value)
											break
										case 'Error':
											var d = new Error()
											for (var e in a[c].value)
												d[e] = a[c].value[e]
											b.push(d)
											break
										case 'DataView':
											b.push(new DataView(a[c].value))
									}
								return b
							}
						}
					}.call(
						this,
						'undefined' != typeof global
							? global
							: 'undefined' != typeof self
								? self
								: 'undefined' != typeof window
									? window
									: {}
					))
				},
				{}
			],
			2: [
				function(a, b, c) {
					'use strict'
					function d(a, b) {
						function c(a, b) {
							var c = e.serializeArgs(b || []),
								d = { name: a, args: c.args }
							j.postMessage(d, c.transferable)
						}
						function d(a) {
							var b = a.data || {},
								c = e.unserializeArgs(b.args || [])
							switch (b.name) {
								case 'threadify-return':
									l.done = c
									break
								case 'threadify-error':
									l.failed = c
									break
								case 'threadify-terminated':
									l.terminated = []
							}
							g()
						}
						function f(a) {
							;(l.failed = [a]), g(), h()
						}
						function g() {
							for (var a in k)
								k[a] &&
									l[a] &&
									(k[a].apply(i, l[a]), (l[a] = null))
						}
						function h() {
							j.terminate(), (l.terminated = []), g()
						}
						var i = this,
							j = new Worker(a),
							k = { done: null, failed: null, terminated: null },
							l = { done: null, failed: null, terminated: null }
						Object.defineProperty(this, 'done', {
							get: function() {
								return k.done
							},
							set: function(a) {
								;(k.done = a), g()
							},
							enumerable: !0,
							configurable: !1
						}),
							Object.defineProperty(this, 'failed', {
								get: function() {
									return k.failed
								},
								set: function(a) {
									;(k.failed = a), g()
								},
								enumerable: !0,
								configurable: !1
							}),
							Object.defineProperty(this, 'terminated', {
								get: function() {
									return k.terminated
								},
								set: function(a) {
									;(k.terminated = a), g()
								},
								enumerable: !0,
								configurable: !1
							}),
							(this.terminate = h),
							j.addEventListener('message', d.bind(this), !1),
							j.addEventListener('error', f.bind(this), !1),
							c('threadify-start', b)
					}
					var e = a('./helpers.js')
					b.exports = d
				},
				{ './helpers.js': 1 }
			],
			3: [
				function(a, b, c) {
					'use strict'
					function d(a) {
						var b = new Blob(
								[
									'var global=this;(',
									g.toString(),
									')(',
									a.toString(),
									',',
									e.serializeArgs.toString(),
									',',
									e.unserializeArgs.toString(),
									');'
								],
								{ type: 'application/javascript' }
							),
							c = URL.createObjectURL(b)
						return function() {
							for (var a = [], b = 0; b < arguments.length; b++)
								a.push(arguments[b])
							return new f(c, a)
						}
					}
					var e = a('./helpers.js'),
						f = a('./job.js'),
						g = a('./workercode.js')
					b.exports = d
				},
				{ './helpers.js': 1, './job.js': 2, './workercode.js': 4 }
			],
			4: [
				function(a, b, c) {
					b.exports = function(a, b, c) {
						'use strict'
						function d(a, c) {
							var d = b(c || []),
								e = { name: a, args: d.args }
							postMessage(e, d.transferable)
						}
						function e(b) {
							var e = b.data || {},
								g = c(e.args || [])
							switch (e.name) {
								case 'threadify-start':
									var h
									try {
										h = a.apply(f, g)
									} catch (i) {
										f.error(i), f.terminate()
									}
									void 0 !== h &&
										(d('threadify-return', [h]),
										f.terminate())
							}
						}
						var f = {
							terminate: function() {
								d('threadify-terminated', []), close()
							},
							error: function() {
								d('threadify-error', arguments)
							},
							return: function() {
								d('threadify-return', arguments), f.terminate()
							}
						}
						addEventListener('message', e, !1)
					}
				},
				{}
			]
		},
		{},
		[3]
	)(3)
})
