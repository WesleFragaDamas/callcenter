"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var db = require('../../config/database');
var bcrypt = require('bcryptjs');

// FUNÇÃO 1: Busca todos os usuários (para o admin)
var getAllUsers = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(req, res) {
    var query, _yield$db$query, rows, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          query = "\n      SELECT u.id, u.username, u.full_name, r.name as role, u.is_active\n      FROM users u\n      JOIN roles r ON u.role_id = r.id\n      ORDER BY u.full_name ASC;\n    ";
          _context.n = 1;
          return db.query(query);
        case 1:
          _yield$db$query = _context.v;
          rows = _yield$db$query.rows;
          res.status(200).json(rows);
          _context.n = 3;
          break;
        case 2:
          _context.p = 2;
          _t = _context.v;
          console.error('Erro ao buscar todos os usuários:', _t);
          res.status(500).json({
            message: 'Erro interno no servidor.'
          });
        case 3:
          return _context.a(2);
      }
    }, _callee, null, [[0, 2]]);
  }));
  return function getAllUsers(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

// FUNÇÃO 2: Busca apenas os operadores ATIVOS
var getOperators = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var query, _yield$db$query2, rows, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          query = "\n      SELECT u.id, u.full_name, u.username\n      FROM users u\n      JOIN roles r ON u.role_id = r.id\n      WHERE r.name = 'OPERATOR' AND u.is_active = true\n      ORDER BY u.full_name ASC;\n    ";
          _context2.n = 1;
          return db.query(query);
        case 1:
          _yield$db$query2 = _context2.v;
          rows = _yield$db$query2.rows;
          res.status(200).json(rows);
          _context2.n = 3;
          break;
        case 2:
          _context2.p = 2;
          _t2 = _context2.v;
          console.error('Erro ao buscar operadores:', _t2);
          res.status(500).json({
            message: 'Erro interno no servidor.'
          });
        case 3:
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 2]]);
  }));
  return function getOperators(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

// FUNÇÃO 3: Cria um novo usuário
var createUser = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    var _req$body, username, password, full_name, role_id, password_hash, query, _yield$db$query3, rows, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _req$body = req.body, username = _req$body.username, password = _req$body.password, full_name = _req$body.full_name, role_id = _req$body.role_id;
          if (!(!username || !password || !full_name || !role_id)) {
            _context3.n = 1;
            break;
          }
          return _context3.a(2, res.status(400).json({
            message: 'Todos os campos são obrigatórios.'
          }));
        case 1:
          _context3.p = 1;
          _context3.n = 2;
          return bcrypt.hash(password, 10);
        case 2:
          password_hash = _context3.v;
          query = "\n      INSERT INTO users (username, password_hash, full_name, role_id)\n      VALUES ($1, $2, $3, $4)\n      RETURNING id, username, full_name, role_id;\n    ";
          _context3.n = 3;
          return db.query(query, [username, password_hash, full_name, role_id]);
        case 3:
          _yield$db$query3 = _context3.v;
          rows = _yield$db$query3.rows;
          res.status(201).json(rows[0]);
          _context3.n = 6;
          break;
        case 4:
          _context3.p = 4;
          _t3 = _context3.v;
          if (!(_t3.code === '23505')) {
            _context3.n = 5;
            break;
          }
          return _context3.a(2, res.status(409).json({
            message: 'Nome de usuário já existe.'
          }));
        case 5:
          console.error('Erro ao criar usuário:', _t3);
          res.status(500).json({
            message: 'Erro interno no servidor.'
          });
        case 6:
          return _context3.a(2);
      }
    }, _callee3, null, [[1, 4]]);
  }));
  return function createUser(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

// FUNÇÃO 4 (NOVA): Atualiza um usuário
var updateUser = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
    var userId, _req$body2, username, full_name, role_id, query, _yield$db$query4, rows, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          userId = req.params.userId;
          _req$body2 = req.body, username = _req$body2.username, full_name = _req$body2.full_name, role_id = _req$body2.role_id;
          if (!(!username || !full_name || !role_id)) {
            _context4.n = 1;
            break;
          }
          return _context4.a(2, res.status(400).json({
            message: 'Nome, nome de usuário e função são obrigatórios.'
          }));
        case 1:
          _context4.p = 1;
          query = "\n      UPDATE users SET username = $1, full_name = $2, role_id = $3\n      WHERE id = $4 RETURNING id, username, full_name, role_id;\n    ";
          _context4.n = 2;
          return db.query(query, [username, full_name, role_id, userId]);
        case 2:
          _yield$db$query4 = _context4.v;
          rows = _yield$db$query4.rows;
          if (!(rows.length === 0)) {
            _context4.n = 3;
            break;
          }
          return _context4.a(2, res.status(404).json({
            message: 'Usuário não encontrado.'
          }));
        case 3:
          res.status(200).json(rows[0]);
          _context4.n = 6;
          break;
        case 4:
          _context4.p = 4;
          _t4 = _context4.v;
          if (!(_t4.code === '23505')) {
            _context4.n = 5;
            break;
          }
          return _context4.a(2, res.status(409).json({
            message: 'Nome de usuário já existe.'
          }));
        case 5:
          console.error('Erro ao atualizar usuário:', _t4);
          res.status(500).json({
            message: 'Erro interno no servidor.'
          });
        case 6:
          return _context4.a(2);
      }
    }, _callee4, null, [[1, 4]]);
  }));
  return function updateUser(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

// FUNÇÃO 5 (NOVA): Desativa/Reativa um usuário
var toggleUserActive = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
    var userId, is_active, query, _yield$db$query5, rows, _t5;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          userId = req.params.userId;
          is_active = req.body.is_active;
          if (!(typeof is_active !== 'boolean')) {
            _context5.n = 1;
            break;
          }
          return _context5.a(2, res.status(400).json({
            message: 'O estado "is_active" é obrigatório e deve ser booleano.'
          }));
        case 1:
          _context5.p = 1;
          query = "\n      UPDATE users SET is_active = $1 WHERE id = $2 RETURNING id, is_active;\n    ";
          _context5.n = 2;
          return db.query(query, [is_active, userId]);
        case 2:
          _yield$db$query5 = _context5.v;
          rows = _yield$db$query5.rows;
          if (!(rows.length === 0)) {
            _context5.n = 3;
            break;
          }
          return _context5.a(2, res.status(404).json({
            message: 'Usuário não encontrado.'
          }));
        case 3:
          res.status(200).json(rows[0]);
          _context5.n = 5;
          break;
        case 4:
          _context5.p = 4;
          _t5 = _context5.v;
          console.error('Erro ao ativar/desativar usuário:', _t5);
          res.status(500).json({
            message: 'Erro interno no servidor.'
          });
        case 5:
          return _context5.a(2);
      }
    }, _callee5, null, [[1, 4]]);
  }));
  return function toggleUserActive(_x9, _x0) {
    return _ref5.apply(this, arguments);
  };
}();
module.exports = {
  getAllUsers: getAllUsers,
  getOperators: getOperators,
  createUser: createUser,
  updateUser: updateUser,
  toggleUserActive: toggleUserActive
};