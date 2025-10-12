"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// ... (depois da função getPendingRequests)

var approveRequest = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var requestId, userId, query, _yield$db$query, rows, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          requestId = req.params.requestId; // Pega o ID da URL
          userId = req.body.userId; // Pega o ID do supervisor que está aprovando
          _context.p = 1;
          query = "\n      UPDATE pause_requests \n      SET status = 'APPROVED', \n          handled_by = $1, \n          handled_at = NOW() \n      WHERE id = $2 AND status = 'PENDING'\n      RETURNING *;\n    ";
          _context.n = 2;
          return db.query(query, [userId, requestId]);
        case 2:
          _yield$db$query = _context.v;
          rows = _yield$db$query.rows;
          if (!(rows.length === 0)) {
            _context.n = 3;
            break;
          }
          return _context.a(2, res.status(404).json({
            message: 'Solicitação não encontrada ou já foi tratada.'
          }));
        case 3:
          console.log('Solicitação aprovada:', rows[0]);
          res.status(200).json(rows[0]);
          _context.n = 5;
          break;
        case 4:
          _context.p = 4;
          _t = _context.v;
          console.error('Erro ao aprovar solicitação:', _t);
          res.status(500).json({
            message: 'Erro interno no servidor.'
          });
        case 5:
          return _context.a(2);
      }
    }, _callee, null, [[1, 4]]);
  }));
  return function approveRequest(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
var rejectRequest = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var requestId, userId, query, _yield$db$query2, rows, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          requestId = req.params.requestId;
          userId = req.body.userId;
          _context2.p = 1;
          query = "\n      UPDATE pause_requests \n      SET status = 'REJECTED',\n          handled_by = $1,\n          handled_at = NOW()\n      WHERE id = $2 AND status = 'PENDING'\n      RETURNING *;\n    ";
          _context2.n = 2;
          return db.query(query, [userId, requestId]);
        case 2:
          _yield$db$query2 = _context2.v;
          rows = _yield$db$query2.rows;
          if (!(rows.length === 0)) {
            _context2.n = 3;
            break;
          }
          return _context2.a(2, res.status(404).json({
            message: 'Solicitação não encontrada ou já foi tratada.'
          }));
        case 3:
          console.log('Solicitação rejeitada:', rows[0]);
          res.status(200).json(rows[0]);
          _context2.n = 5;
          break;
        case 4:
          _context2.p = 4;
          _t2 = _context2.v;
          console.error('Erro ao rejeitar solicitação:', _t2);
          res.status(500).json({
            message: 'Erro interno no servidor.'
          });
        case 5:
          return _context2.a(2);
      }
    }, _callee2, null, [[1, 4]]);
  }));
  return function rejectRequest(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

// Atualize o module.exports para incluir as novas funções
module.exports = {
  getPauseTypes: getPauseTypes,
  requestPause: requestPause,
  getPendingRequests: getPendingRequests,
  approveRequest: approveRequest,
  // Adicione aqui
  rejectRequest: rejectRequest // E aqui
};