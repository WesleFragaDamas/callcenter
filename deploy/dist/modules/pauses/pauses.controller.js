"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var db = require('../../config/database');
var PAUSE_LIMIT_PERCENTAGE = 0.15; // 15%

// Função auxiliar para verificar a fila e promover o próximo, se houver vaga
var checkQueueAndPromote = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(db) {
    var operatorsResult, totalOperators, pauseLimit, onPauseResult, operatorsOnPause, availableSlots, nextInQueueResult, idsToPromote, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          _context.p = 0;
          _context.n = 1;
          return db.query("SELECT COUNT(id) AS total_operators FROM users WHERE role_id = (SELECT id FROM roles WHERE name = 'OPERATOR') AND is_active = true");
        case 1:
          operatorsResult = _context.v;
          totalOperators = parseInt(operatorsResult.rows[0].total_operators, 10);
          if (!(totalOperators === 0)) {
            _context.n = 2;
            break;
          }
          return _context.a(2);
        case 2:
          pauseLimit = totalOperators > 0 ? Math.max(1, Math.floor(totalOperators * PAUSE_LIMIT_PERCENTAGE)) : 0;
          _context.n = 3;
          return db.query("SELECT COUNT(id) AS operators_on_pause FROM pause_requests WHERE status = 'IN_PROGRESS'");
        case 3:
          onPauseResult = _context.v;
          operatorsOnPause = parseInt(onPauseResult.rows[0].operators_on_pause, 10);
          availableSlots = pauseLimit - operatorsOnPause;
          if (!(availableSlots <= 0)) {
            _context.n = 4;
            break;
          }
          console.log('Fila verificada, sem vagas disponíveis.');
          return _context.a(2);
        case 4:
          _context.n = 5;
          return db.query("SELECT id FROM pause_requests WHERE status = 'QUEUED' ORDER BY requested_at ASC LIMIT $1;", [availableSlots]);
        case 5:
          nextInQueueResult = _context.v;
          if (!(nextInQueueResult.rows.length > 0)) {
            _context.n = 7;
            break;
          }
          idsToPromote = nextInQueueResult.rows.map(function (row) {
            return row.id;
          });
          _context.n = 6;
          return db.query("UPDATE pause_requests SET status = 'APPROVED' WHERE id = ANY($1::int[])", [idsToPromote]);
        case 6:
          console.log("Vaga(s) liberada(s)! Solicita\xE7\xF5es ".concat(idsToPromote.join(', '), " foram aprovadas da fila."));
        case 7:
          _context.n = 9;
          break;
        case 8:
          _context.p = 8;
          _t = _context.v;
          console.error("Erro ao verificar a fila de espera:", _t);
        case 9:
          return _context.a(2);
      }
    }, _callee, null, [[0, 8]]);
  }));
  return function checkQueueAndPromote(_x) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Busca todos os tipos de pausa disponíveis.
 */
var getPauseTypes = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(req, res) {
    var query, _yield$db$query, rows, _t2;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          _context2.p = 0;
          query = 'SELECT * FROM pause_types ORDER BY name';
          _context2.n = 1;
          return db.query(query);
        case 1:
          _yield$db$query = _context2.v;
          rows = _yield$db$query.rows;
          res.status(200).json(rows);
          _context2.n = 3;
          break;
        case 2:
          _context2.p = 2;
          _t2 = _context2.v;
          console.error('Erro ao buscar tipos de pausa:', _t2);
          res.status(500).json({
            message: 'Erro interno no servidor.'
          });
        case 3:
          return _context2.a(2);
      }
    }, _callee2, null, [[0, 2]]);
  }));
  return function getPauseTypes(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
}();

/**
 * Busca solicitações PENDENTES e em FILA para o supervisor.
 */
var getPendingRequests = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(req, res) {
    var query, _yield$db$query2, rows, _t3;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.p = _context3.n) {
        case 0:
          _context3.p = 0;
          query = "\n      SELECT \n        pr.id AS request_id,\n        u.full_name AS user_full_name,\n        pt.name AS pause_type_name,\n        pr.status\n      FROM pause_requests pr\n      JOIN users u ON pr.user_id = u.id\n      JOIN pause_types pt ON pr.pause_type_id = pt.id\n      WHERE pr.status IN ('PENDING', 'QUEUED')\n      ORDER BY pr.status DESC, pr.requested_at ASC;\n    ";
          _context3.n = 1;
          return db.query(query);
        case 1:
          _yield$db$query2 = _context3.v;
          rows = _yield$db$query2.rows;
          res.status(200).json(rows);
          _context3.n = 3;
          break;
        case 2:
          _context3.p = 2;
          _t3 = _context3.v;
          console.error('Erro ao buscar solicitações pendentes e em fila:', _t3);
          res.status(500).json({
            message: 'Erro interno no servidor.'
          });
        case 3:
          return _context3.a(2);
      }
    }, _callee3, null, [[0, 2]]);
  }));
  return function getPendingRequests(_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}();

/**
 * Busca uma solicitação de pausa específica pelo seu ID.
 * Usado pelo operador para verificar o status de sua própria solicitação.
 */
var getRequestById = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(req, res) {
    var requestId, query, _yield$db$query3, rows, _t4;
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.p = _context4.n) {
        case 0:
          requestId = req.params.requestId;
          _context4.p = 1;
          query = 'SELECT id, status FROM pause_requests WHERE id = $1';
          _context4.n = 2;
          return db.query(query, [requestId]);
        case 2:
          _yield$db$query3 = _context4.v;
          rows = _yield$db$query3.rows;
          if (!(rows.length === 0)) {
            _context4.n = 3;
            break;
          }
          return _context4.a(2, res.status(404).json({
            message: 'Solicitação não encontrada.'
          }));
        case 3:
          res.status(200).json(rows[0]);
          _context4.n = 5;
          break;
        case 4:
          _context4.p = 4;
          _t4 = _context4.v;
          console.error('Erro ao buscar solicitação por ID:', _t4);
          res.status(500).json({
            message: 'Erro interno no servidor.'
          });
        case 5:
          return _context4.a(2);
      }
    }, _callee4, null, [[1, 4]]);
  }));
  return function getRequestById(_x6, _x7) {
    return _ref4.apply(this, arguments);
  };
}();

/**
 * Busca a última solicitação de pausa ATIVA (PENDING, APPROVED, IN_PROGRESS) de um usuário.
 * Usado pelo operador para sincronizar seu estado ao carregar a página.
 */
var getActiveRequestByUser = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(req, res) {
    var userId, query, _yield$db$query4, rows, _t5;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          userId = req.params.userId;
          _context5.p = 1;
          query = "\n      SELECT \n        pr.*, \n        pt.duration_minutes,\n        pt.timer_type,\n        pt.name as pause_type_name\n      FROM pause_requests pr\n      LEFT JOIN pause_types pt ON pr.pause_type_id = pt.id\n      WHERE pr.user_id = $1 AND pr.status IN ('PENDING', 'APPROVED', 'IN_PROGRESS')\n      ORDER BY pr.requested_at DESC\n      LIMIT 1;\n    ";
          _context5.n = 2;
          return db.query(query, [userId]);
        case 2:
          _yield$db$query4 = _context5.v;
          rows = _yield$db$query4.rows;
          if (!(rows.length === 0)) {
            _context5.n = 3;
            break;
          }
          return _context5.a(2, res.status(200).json(null));
        case 3:
          res.status(200).json(rows[0]);
          _context5.n = 5;
          break;
        case 4:
          _context5.p = 4;
          _t5 = _context5.v;
          console.error('Erro ao buscar solicitação ativa do usuário:', _t5);
          res.status(500).json({
            message: 'Erro interno no servidor.'
          });
        case 5:
          return _context5.a(2);
      }
    }, _callee5, null, [[1, 4]]);
  }));
  return function getActiveRequestByUser(_x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();

/**
 * Busca dados para o Dashboard de Monitoramento do Supervisor.
 * Retorna um objeto com a lista de pausas ativas e estatísticas da equipe.
 */
var getPauseMonitor = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6(req, res) {
    var pausesQuery, operatorsQuery, _yield$Promise$all, _yield$Promise$all2, pausesResult, operatorsResult, activePauses, totalOperators, operatorsOnPause, responseData, _t6;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          _context6.p = 0;
          pausesQuery = "\n      SELECT \n        pr.id AS request_id, pr.user_id, u.full_name AS user_full_name,\n        pt.name AS pause_type_name, pt.duration_minutes, pt.timer_type,\n        pr.status, pr.start_time\n      FROM pause_requests pr\n      JOIN users u ON pr.user_id = u.id\n      JOIN pause_types pt ON pr.pause_type_id = pt.id\n      WHERE pr.status IN ('APPROVED', 'IN_PROGRESS')\n      ORDER BY CASE pr.status WHEN 'IN_PROGRESS' THEN 1 ELSE 2 END, \n      pr.start_time ASC, pr.requested_at ASC;\n    "; // CORREÇÃO APLICADA AQUI: Adicionado "AND u.is_active = true"
          operatorsQuery = "\n      SELECT COUNT(u.id) AS total_operators\n      FROM users u\n      JOIN roles r ON u.role_id = r.id\n      WHERE r.name = 'OPERATOR' AND u.is_active = true;\n    ";
          _context6.n = 1;
          return Promise.all([db.query(pausesQuery), db.query(operatorsQuery)]);
        case 1:
          _yield$Promise$all = _context6.v;
          _yield$Promise$all2 = _slicedToArray(_yield$Promise$all, 2);
          pausesResult = _yield$Promise$all2[0];
          operatorsResult = _yield$Promise$all2[1];
          activePauses = pausesResult.rows;
          totalOperators = parseInt(operatorsResult.rows[0].total_operators, 10);
          operatorsOnPause = activePauses.filter(function (p) {
            return p.status === 'IN_PROGRESS';
          }).length;
          responseData = {
            activePauses: activePauses,
            stats: {
              totalOperators: totalOperators,
              operatorsOnPause: operatorsOnPause
            }
          };
          res.status(200).json(responseData);
          _context6.n = 3;
          break;
        case 2:
          _context6.p = 2;
          _t6 = _context6.v;
          console.error('Erro ao buscar dados para o monitor de pausas:', _t6);
          res.status(500).json({
            message: 'Erro interno no servidor.'
          });
        case 3:
          return _context6.a(2);
      }
    }, _callee6, null, [[0, 2]]);
  }));
  return function getPauseMonitor(_x0, _x1) {
    return _ref6.apply(this, arguments);
  };
}();

// ====================================================================
// FUNÇÕES DE AÇÃO DO OPERADOR (POST)
// ====================================================================

/**
 * Registra uma nova solicitação de pausa.
 */
var requestPause = /*#__PURE__*/function () {
  var _ref7 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7(req, res) {
    var _req$body, userId, pauseTypeId, existingPauseQuery, _yield$db$query5, existingPauses, insertQuery, _yield$db$query6, rows, _t7;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          _req$body = req.body, userId = _req$body.userId, pauseTypeId = _req$body.pauseTypeId;
          if (!(!userId || !pauseTypeId)) {
            _context7.n = 1;
            break;
          }
          return _context7.a(2, res.status(400).json({
            message: 'ID do usuário e tipo de pausa são obrigatórios.'
          }));
        case 1:
          _context7.p = 1;
          existingPauseQuery = "SELECT * FROM pause_requests WHERE user_id = $1 AND status IN ('PENDING', 'APPROVED', 'IN_PROGRESS')";
          _context7.n = 2;
          return db.query(existingPauseQuery, [userId]);
        case 2:
          _yield$db$query5 = _context7.v;
          existingPauses = _yield$db$query5.rows;
          if (!(existingPauses.length > 0)) {
            _context7.n = 3;
            break;
          }
          return _context7.a(2, res.status(409).json({
            message: 'Você já possui uma pausa pendente ou em andamento.'
          }));
        case 3:
          insertQuery = "INSERT INTO pause_requests (user_id, pause_type_id, status) VALUES ($1, $2, 'PENDING') RETURNING *";
          _context7.n = 4;
          return db.query(insertQuery, [userId, pauseTypeId]);
        case 4:
          _yield$db$query6 = _context7.v;
          rows = _yield$db$query6.rows;
          res.status(201).json({
            message: 'Solicitação de pausa registrada com sucesso!',
            request: rows[0]
          });
          _context7.n = 6;
          break;
        case 5:
          _context7.p = 5;
          _t7 = _context7.v;
          console.error('Erro ao registrar solicitação de pausa:', _t7);
          res.status(500).json({
            message: 'Erro interno no servidor.'
          });
        case 6:
          return _context7.a(2);
      }
    }, _callee7, null, [[1, 5]]);
  }));
  return function requestPause(_x10, _x11) {
    return _ref7.apply(this, arguments);
  };
}();

/**
 * Inicia uma pausa que já foi aprovada.
 */
var startPause = /*#__PURE__*/function () {
  var _ref8 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8(req, res) {
    var requestId, userId, query, _yield$db$query7, rows, detailsQuery, detailsResult, responseData, _t8;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          requestId = req.params.requestId;
          userId = req.body.userId;
          _context8.p = 1;
          query = "UPDATE pause_requests SET status = 'IN_PROGRESS', start_time = NOW() WHERE id = $1 AND user_id = $2 AND status = 'APPROVED' RETURNING *;";
          _context8.n = 2;
          return db.query(query, [requestId, userId]);
        case 2:
          _yield$db$query7 = _context8.v;
          rows = _yield$db$query7.rows;
          if (!(rows.length === 0)) {
            _context8.n = 3;
            break;
          }
          return _context8.a(2, res.status(404).json({
            message: 'Pausa não encontrada, não pertence a você ou não foi aprovada.'
          }));
        case 3:
          detailsQuery = "SELECT pt.duration_minutes, pt.timer_type FROM pause_requests pr JOIN pause_types pt ON pr.pause_type_id = pt.id WHERE pr.id = $1";
          _context8.n = 4;
          return db.query(detailsQuery, [requestId]);
        case 4:
          detailsResult = _context8.v;
          responseData = _objectSpread(_objectSpread({}, rows[0]), detailsResult.rows[0]);
          res.status(200).json(responseData);
          _context8.n = 6;
          break;
        case 5:
          _context8.p = 5;
          _t8 = _context8.v;
          console.error('Erro ao iniciar pausa:', _t8);
          res.status(500).json({
            message: 'Erro interno no servidor.'
          });
        case 6:
          return _context8.a(2);
      }
    }, _callee8, null, [[1, 5]]);
  }));
  return function startPause(_x12, _x13) {
    return _ref8.apply(this, arguments);
  };
}();

/**
 * Finaliza uma pausa que está em andamento.
 */
var endPause = /*#__PURE__*/function () {
  var _ref9 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9(req, res) {
    var requestId, userId, query, _yield$db$query8, rows, _t9;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.p = _context9.n) {
        case 0:
          requestId = req.params.requestId;
          userId = req.body.userId;
          _context9.p = 1;
          query = "UPDATE pause_requests SET status = 'COMPLETED', end_time = NOW() WHERE id = $1 AND user_id = $2 AND status = 'IN_PROGRESS' RETURNING *;";
          _context9.n = 2;
          return db.query(query, [requestId, userId]);
        case 2:
          _yield$db$query8 = _context9.v;
          rows = _yield$db$query8.rows;
          if (!(rows.length === 0)) {
            _context9.n = 3;
            break;
          }
          return _context9.a(2, res.status(404).json({
            message: 'Pausa não encontrada ou não está em progresso.'
          }));
        case 3:
          _context9.n = 4;
          return checkQueueAndPromote(db);
        case 4:
          res.status(200).json(rows[0]);
          _context9.n = 6;
          break;
        case 5:
          _context9.p = 5;
          _t9 = _context9.v;
          console.error('Erro ao finalizar pausa:', _t9);
          res.status(500).json({
            message: 'Erro interno no servidor.'
          });
        case 6:
          return _context9.a(2);
      }
    }, _callee9, null, [[1, 5]]);
  }));
  return function endPause(_x14, _x15) {
    return _ref9.apply(this, arguments);
  };
}();

/**
 * Cancela uma solicitação de pausa PENDENTE.
 */
var cancelRequest = /*#__PURE__*/function () {
  var _ref0 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0(req, res) {
    var requestId, userId, query, _yield$db$query9, rows, _t0;
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.p = _context0.n) {
        case 0:
          requestId = req.params.requestId;
          userId = req.body.userId;
          _context0.p = 1;
          query = "UPDATE pause_requests SET status = 'CANCELLED' WHERE id = $1 AND user_id = $2 AND status = 'PENDING' RETURNING *;";
          _context0.n = 2;
          return db.query(query, [requestId, userId]);
        case 2:
          _yield$db$query9 = _context0.v;
          rows = _yield$db$query9.rows;
          if (!(rows.length === 0)) {
            _context0.n = 3;
            break;
          }
          return _context0.a(2, res.status(404).json({
            message: 'Solicitação não encontrada, já foi tratada ou não pertence a este usuário.'
          }));
        case 3:
          res.status(200).json(rows[0]);
          _context0.n = 5;
          break;
        case 4:
          _context0.p = 4;
          _t0 = _context0.v;
          console.error('Erro ao cancelar solicitação:', _t0);
          res.status(500).json({
            message: 'Erro interno no servidor.'
          });
        case 5:
          return _context0.a(2);
      }
    }, _callee0, null, [[1, 4]]);
  }));
  return function cancelRequest(_x16, _x17) {
    return _ref0.apply(this, arguments);
  };
}();

// ====================================================================
// FUNÇÕES DE AÇÃO DO SUPERVISOR (POST)
// ====================================================================

/**
 * Aprova uma solicitação de pausa PENDENTE.
 */
var approveRequest = /*#__PURE__*/function () {
  var _ref1 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1(req, res) {
    var requestId, supervisorId, operatorsResult, totalOperators, pauseLimit, onPauseResult, operatorsOnPause, newStatus, updateQuery, _yield$db$query0, rows, _t1;
    return _regenerator().w(function (_context1) {
      while (1) switch (_context1.p = _context1.n) {
        case 0:
          requestId = req.params.requestId;
          supervisorId = req.body.userId;
          _context1.p = 1;
          _context1.n = 2;
          return db.query("SELECT COUNT(id) AS total_operators FROM users WHERE role_id = (SELECT id FROM roles WHERE name = 'OPERATOR') AND is_active = true");
        case 2:
          operatorsResult = _context1.v;
          totalOperators = parseInt(operatorsResult.rows[0].total_operators, 10);
          pauseLimit = totalOperators > 0 ? Math.max(1, Math.floor(totalOperators * PAUSE_LIMIT_PERCENTAGE)) : 0;
          _context1.n = 3;
          return db.query("SELECT COUNT(id) AS operators_on_pause FROM pause_requests WHERE status = 'IN_PROGRESS'");
        case 3:
          onPauseResult = _context1.v;
          operatorsOnPause = parseInt(onPauseResult.rows[0].operators_on_pause, 10);
          newStatus = operatorsOnPause < pauseLimit ? 'APPROVED' : 'QUEUED';
          updateQuery = "UPDATE pause_requests SET status = $1, handled_by = $2, handled_at = NOW() WHERE id = $3 AND status = 'PENDING' RETURNING *;";
          _context1.n = 4;
          return db.query(updateQuery, [newStatus, supervisorId, requestId]);
        case 4:
          _yield$db$query0 = _context1.v;
          rows = _yield$db$query0.rows;
          if (!(rows.length === 0)) {
            _context1.n = 5;
            break;
          }
          return _context1.a(2, res.status(404).json({
            message: 'Solicitação não encontrada ou já foi tratada.'
          }));
        case 5:
          console.log("Solicita\xE7\xE3o ".concat(requestId, " movida para o status: ").concat(newStatus));
          res.status(200).json(rows[0]);
          _context1.n = 7;
          break;
        case 6:
          _context1.p = 6;
          _t1 = _context1.v;
          console.error('Erro ao aprovar/colocar em fila a solicitação:', _t1);
          res.status(500).json({
            message: 'Erro interno no servidor.'
          });
        case 7:
          return _context1.a(2);
      }
    }, _callee1, null, [[1, 6]]);
  }));
  return function approveRequest(_x18, _x19) {
    return _ref1.apply(this, arguments);
  };
}();

/**
 * Rejeita uma solicitação de pausa PENDENTE.
 */
var rejectRequest = /*#__PURE__*/function () {
  var _ref10 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10(req, res) {
    var requestId, userId, query, _yield$db$query1, rows, _t10;
    return _regenerator().w(function (_context10) {
      while (1) switch (_context10.p = _context10.n) {
        case 0:
          requestId = req.params.requestId;
          userId = req.body.userId;
          _context10.p = 1;
          query = "UPDATE pause_requests SET status = 'REJECTED', handled_by = $1, handled_at = NOW() WHERE id = $2 AND status = 'PENDING' RETURNING *;";
          _context10.n = 2;
          return db.query(query, [userId, requestId]);
        case 2:
          _yield$db$query1 = _context10.v;
          rows = _yield$db$query1.rows;
          if (!(rows.length === 0)) {
            _context10.n = 3;
            break;
          }
          return _context10.a(2, res.status(404).json({
            message: 'Solicitação não encontrada ou já foi tratada.'
          }));
        case 3:
          res.status(200).json(rows[0]);
          _context10.n = 5;
          break;
        case 4:
          _context10.p = 4;
          _t10 = _context10.v;
          console.error('Erro ao rejeitar solicitação:', _t10);
          res.status(500).json({
            message: 'Erro interno no servidor.'
          });
        case 5:
          return _context10.a(2);
      }
    }, _callee10, null, [[1, 4]]);
  }));
  return function rejectRequest(_x20, _x21) {
    return _ref10.apply(this, arguments);
  };
}();

/**
 * Força o início de uma pausa para um operador.
 */
var forcePause = /*#__PURE__*/function () {
  var _ref11 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee11(req, res) {
    var _req$body2, operatorId, pauseTypeId, supervisorId, existingPauseQuery, _yield$db$query10, existingPauses, insertQuery, _yield$db$query11, rows, _t11;
    return _regenerator().w(function (_context11) {
      while (1) switch (_context11.p = _context11.n) {
        case 0:
          _req$body2 = req.body, operatorId = _req$body2.operatorId, pauseTypeId = _req$body2.pauseTypeId, supervisorId = _req$body2.supervisorId;
          if (!(!operatorId || !pauseTypeId || !supervisorId)) {
            _context11.n = 1;
            break;
          }
          return _context11.a(2, res.status(400).json({
            message: 'IDs do operador, tipo de pausa e supervisor são obrigatórios.'
          }));
        case 1:
          _context11.p = 1;
          existingPauseQuery = "SELECT * FROM pause_requests WHERE user_id = $1 AND status IN ('PENDING', 'APPROVED', 'IN_PROGRESS')";
          _context11.n = 2;
          return db.query(existingPauseQuery, [operatorId]);
        case 2:
          _yield$db$query10 = _context11.v;
          existingPauses = _yield$db$query10.rows;
          if (!(existingPauses.length > 0)) {
            _context11.n = 3;
            break;
          }
          return _context11.a(2, res.status(409).json({
            message: 'Este operador já possui uma pausa ativa.'
          }));
        case 3:
          insertQuery = "INSERT INTO pause_requests (user_id, pause_type_id, status, handled_by, handled_at, start_time) VALUES ($1, $2, 'IN_PROGRESS', $3, NOW(), NOW()) RETURNING *;";
          _context11.n = 4;
          return db.query(insertQuery, [operatorId, pauseTypeId, supervisorId]);
        case 4:
          _yield$db$query11 = _context11.v;
          rows = _yield$db$query11.rows;
          res.status(201).json({
            message: 'Pausa forçada com sucesso!',
            request: rows[0]
          });
          _context11.n = 6;
          break;
        case 5:
          _context11.p = 5;
          _t11 = _context11.v;
          console.error('Erro ao forçar pausa:', _t11);
          res.status(500).json({
            message: 'Erro interno no servidor.'
          });
        case 6:
          return _context11.a(2);
      }
    }, _callee11, null, [[1, 5]]);
  }));
  return function forcePause(_x22, _x23) {
    return _ref11.apply(this, arguments);
  };
}();

// ====================================================================
// FUNÇÕES DE ADMINISTRAÇÃO (CRUD de Tipos de Pausa)
// ====================================================================

/**
 * Cria um novo tipo de pausa.
 */
var createPauseType = /*#__PURE__*/function () {
  var _ref12 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee12(req, res) {
    var _req$body3, name, duration_minutes, timer_type, query, _yield$db$query12, rows, _t12;
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.p = _context12.n) {
        case 0:
          _req$body3 = req.body, name = _req$body3.name, duration_minutes = _req$body3.duration_minutes, timer_type = _req$body3.timer_type;
          if (!(!name || typeof duration_minutes !== 'number')) {
            _context12.n = 1;
            break;
          }
          return _context12.a(2, res.status(400).json({
            message: 'Nome e duração (como número) são obrigatórios.'
          }));
        case 1:
          _context12.p = 1;
          query = "INSERT INTO pause_types (name, duration_minutes, timer_type) VALUES ($1, $2, $3) RETURNING *;";
          _context12.n = 2;
          return db.query(query, [name, duration_minutes, timer_type || 'REGRESSIVE']);
        case 2:
          _yield$db$query12 = _context12.v;
          rows = _yield$db$query12.rows;
          res.status(201).json(rows[0]);
          _context12.n = 4;
          break;
        case 3:
          _context12.p = 3;
          _t12 = _context12.v;
          console.error('Erro ao criar tipo de pausa:', _t12);
          res.status(500).json({
            message: 'Erro interno no servidor.'
          });
        case 4:
          return _context12.a(2);
      }
    }, _callee12, null, [[1, 3]]);
  }));
  return function createPauseType(_x24, _x25) {
    return _ref12.apply(this, arguments);
  };
}();

/**
 * Atualiza um tipo de pausa existente.
 */
var updatePauseType = /*#__PURE__*/function () {
  var _ref13 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee13(req, res) {
    var typeId, _req$body4, name, duration_minutes, timer_type, query, _yield$db$query13, rows, _t13;
    return _regenerator().w(function (_context13) {
      while (1) switch (_context13.p = _context13.n) {
        case 0:
          typeId = req.params.typeId;
          _req$body4 = req.body, name = _req$body4.name, duration_minutes = _req$body4.duration_minutes, timer_type = _req$body4.timer_type;
          if (!(!name || typeof duration_minutes !== 'number')) {
            _context13.n = 1;
            break;
          }
          return _context13.a(2, res.status(400).json({
            message: 'Nome e duração (como número) são obrigatórios.'
          }));
        case 1:
          _context13.p = 1;
          query = "UPDATE pause_types SET name = $1, duration_minutes = $2, timer_type = $3 WHERE id = $4 RETURNING *;";
          _context13.n = 2;
          return db.query(query, [name, duration_minutes, timer_type, typeId]);
        case 2:
          _yield$db$query13 = _context13.v;
          rows = _yield$db$query13.rows;
          if (!(rows.length === 0)) {
            _context13.n = 3;
            break;
          }
          return _context13.a(2, res.status(404).json({
            message: 'Tipo de pausa não encontrado.'
          }));
        case 3:
          res.status(200).json(rows[0]);
          _context13.n = 5;
          break;
        case 4:
          _context13.p = 4;
          _t13 = _context13.v;
          console.error('Erro ao atualizar tipo de pausa:', _t13);
          res.status(500).json({
            message: 'Erro interno no servidor.'
          });
        case 5:
          return _context13.a(2);
      }
    }, _callee13, null, [[1, 4]]);
  }));
  return function updatePauseType(_x26, _x27) {
    return _ref13.apply(this, arguments);
  };
}();

/**
 * Deleta um tipo de pausa.
 */
var deletePauseType = /*#__PURE__*/function () {
  var _ref14 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee14(req, res) {
    var typeId, query, _yield$db$query14, rows, _t14;
    return _regenerator().w(function (_context14) {
      while (1) switch (_context14.p = _context14.n) {
        case 0:
          typeId = req.params.typeId;
          _context14.p = 1;
          query = 'DELETE FROM pause_types WHERE id = $1 RETURNING *;';
          _context14.n = 2;
          return db.query(query, [typeId]);
        case 2:
          _yield$db$query14 = _context14.v;
          rows = _yield$db$query14.rows;
          if (!(rows.length === 0)) {
            _context14.n = 3;
            break;
          }
          return _context14.a(2, res.status(404).json({
            message: 'Tipo de pausa não encontrado.'
          }));
        case 3:
          res.status(200).json({
            message: 'Tipo de pausa deletado com sucesso.'
          });
          _context14.n = 5;
          break;
        case 4:
          _context14.p = 4;
          _t14 = _context14.v;
          console.error('Erro ao deletar tipo de pausa:', _t14);
          res.status(500).json({
            message: 'Erro interno no servidor.'
          });
        case 5:
          return _context14.a(2);
      }
    }, _callee14, null, [[1, 4]]);
  }));
  return function deletePauseType(_x28, _x29) {
    return _ref14.apply(this, arguments);
  };
}();

/**
 * FUNÇÃO (NOVA): Força a finalização de uma pausa de um operador.
 * Usada por um supervisor.
 */
var forceEndPause = /*#__PURE__*/function () {
  var _ref15 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee15(req, res) {
    var requestId, supervisorId, query, _yield$db$query15, rows, _t15;
    return _regenerator().w(function (_context15) {
      while (1) switch (_context15.p = _context15.n) {
        case 0:
          requestId = req.params.requestId;
          supervisorId = req.body.supervisorId;
          _context15.p = 1;
          query = "UPDATE pause_requests SET status = 'COMPLETED', end_time = NOW(), handled_by = $1 WHERE id = $2 AND status = 'IN_PROGRESS' RETURNING *;";
          _context15.n = 2;
          return db.query(query, [supervisorId, requestId]);
        case 2:
          _yield$db$query15 = _context15.v;
          rows = _yield$db$query15.rows;
          if (!(rows.length === 0)) {
            _context15.n = 3;
            break;
          }
          return _context15.a(2, res.status(404).json({
            message: 'Pausa não encontrada ou não está em progresso.'
          }));
        case 3:
          _context15.n = 4;
          return checkQueueAndPromote(db);
        case 4:
          res.status(200).json(rows[0]);
          _context15.n = 6;
          break;
        case 5:
          _context15.p = 5;
          _t15 = _context15.v;
          console.error('Erro ao forçar finalização de pausa:', _t15);
          res.status(500).json({
            message: 'Erro interno no servidor.'
          });
        case 6:
          return _context15.a(2);
      }
    }, _callee15, null, [[1, 5]]);
  }));
  return function forceEndPause(_x30, _x31) {
    return _ref15.apply(this, arguments);
  };
}();

// Exporta todas as funções para serem usadas pelo arquivo de rotas.
module.exports = {
  getPauseTypes: getPauseTypes,
  requestPause: requestPause,
  getPendingRequests: getPendingRequests,
  approveRequest: approveRequest,
  rejectRequest: rejectRequest,
  cancelRequest: cancelRequest,
  getRequestById: getRequestById,
  startPause: startPause,
  endPause: endPause,
  getActiveRequestByUser: getActiveRequestByUser,
  getPauseMonitor: getPauseMonitor,
  forcePause: forcePause,
  createPauseType: createPauseType,
  updatePauseType: updatePauseType,
  deletePauseType: deletePauseType,
  forceEndPause: forceEndPause
};