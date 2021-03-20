(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('node-lmdb')) :
    typeof define === 'function' && define.amd ? define(['exports', 'node-lmdb'], factory) :
    (factory((global.notabugGunLmdb = {}),global.lmdb));
}(this, (function (exports,lmdb) { 'use strict';

    lmdb = lmdb && lmdb.hasOwnProperty('default') ? lmdb['default'] : lmdb;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var DEFAULT_CONFIG = {
        path: 'lmdb'
    };
    var GunLmdbClient = /** @class */ (function () {
        function GunLmdbClient(Gun, lmdbConfig) {
            if (lmdbConfig === void 0) { lmdbConfig = DEFAULT_CONFIG; }
            this.Gun = Gun;
            this.env = new lmdb.Env();
            this.env.open(lmdbConfig);
            this.dbi = this.env.openDbi({
                name: 'gun-nodes',
                create: true
            });
        }
        GunLmdbClient.prototype.get = function (soul) {
            return __awaiter(this, void 0, void 0, function () {
                var txn, data;
                return __generator(this, function (_a) {
                    if (!soul)
                        return [2 /*return*/, null];
                    txn = this.env.beginTxn();
                    try {
                        data = this.deserialize(txn.getStringUnsafe(this.dbi, soul));
                        txn.commit();
                        return [2 /*return*/, data];
                    }
                    catch (e) {
                        txn.abort();
                        throw e;
                    }
                    return [2 /*return*/];
                });
            });
        };
        GunLmdbClient.prototype.getRaw = function (soul) {
            return __awaiter(this, void 0, void 0, function () {
                var txn, data;
                return __generator(this, function (_a) {
                    if (!soul)
                        return [2 /*return*/, null];
                    txn = this.env.beginTxn();
                    try {
                        data = txn.getString(this.dbi, soul);
                        txn.commit();
                        return [2 /*return*/, data || ''];
                    }
                    catch (e) {
                        txn.abort();
                        throw e;
                    }
                    return [2 /*return*/];
                });
            });
        };
        GunLmdbClient.prototype.read = function (soul) {
            return __awaiter(this, void 0, void 0, function () {
                var data, _loop_1, this_1, key;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.get(soul)];
                        case 1:
                            data = _a.sent();
                            if (!data)
                                return [2 /*return*/];
                            if (!this.Gun.SEA || soul.indexOf('~') === -1)
                                return [2 /*return*/, data];
                            _loop_1 = function (key) {
                                if (key === '_')
                                    return "continue";
                                this_1.Gun.SEA.verify(this_1.Gun.SEA.opt.pack(data[key], key, data, soul), false, function (res) { return (data[key] = _this.Gun.SEA.opt.unpack(res, key, data)); });
                            };
                            this_1 = this;
                            for (key in data) {
                                _loop_1(key);
                            }
                            return [2 /*return*/, data];
                    }
                });
            });
        };
        GunLmdbClient.prototype.serialize = function (node) {
            return JSON.stringify(node);
        };
        GunLmdbClient.prototype.deserialize = function (data) {
            return JSON.parse(data);
        };
        GunLmdbClient.prototype.writeNode = function (soul, nodeData) {
            return __awaiter(this, void 0, void 0, function () {
                var txn, nodeDataMeta, nodeDataState, existingData, node, meta, state, key;
                return __generator(this, function (_a) {
                    if (!soul)
                        return [2 /*return*/];
                    txn = this.env.beginTxn();
                    nodeDataMeta = (nodeData && nodeData['_']) || {};
                    nodeDataState = nodeDataMeta['>'] || {};
                    try {
                        existingData = txn.getStringUnsafe(this.dbi, soul);
                        node = this.deserialize(existingData) || {};
                        meta = (node['_'] = node['_'] || { '#': soul, '>': {} });
                        state = (meta['>'] = meta['>'] || {});
                        for (key in nodeData) {
                            if (key === '_' || !(key in nodeDataState))
                                continue;
                            node[key] = nodeData[key];
                            state[key] = nodeDataState[key];
                        }
                        txn.putString(this.dbi, soul, this.serialize(node));
                        txn.commit();
                    }
                    catch (e) {
                        txn.abort();
                        throw e;
                    }
                    return [2 /*return*/];
                });
            });
        };
        GunLmdbClient.prototype.write = function (put) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, _i, soul;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            if (!put)
                                return [2 /*return*/];
                            _a = [];
                            for (_b in put)
                                _a.push(_b);
                            _i = 0;
                            _c.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            soul = _a[_i];
                            return [4 /*yield*/, this.writeNode(soul, put[soul])];
                        case 2:
                            _c.sent();
                            _c.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        GunLmdbClient.prototype.close = function () {
            this.dbi.close();
            this.env.close();
        };
        return GunLmdbClient;
    }());
    function createClient(Gun, options) {
        return new GunLmdbClient(Gun, options);
    }

    var respondToGets = function (Gun, _a, lmdbOpts) {
        var _b = _a === void 0 ? {} : _a, _c = _b.disableRelay, disableRelay = _c === void 0 ? true : _c, _d = _b.skipValidation, skipValidation = _d === void 0 ? true : _d;
        if (lmdbOpts === void 0) { lmdbOpts = undefined; }
        return function (db) {
            var lmdb$$1 = (Gun.lmdb = db.lmdb = new GunLmdbClient(Gun, lmdbOpts));
            db.onIn(function gunLmdbRespondToGets(msg) {
                return __awaiter(this, void 0, void 0, function () {
                    var from, json, fromCluster, get, soul, dedupId, rawResult, put, raw, err_1, json_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                from = msg.from, json = msg.json, fromCluster = msg.fromCluster;
                                get = json && json.get;
                                soul = get && get['#'];
                                dedupId = (json && json['#']) || '';
                                if (!soul || fromCluster)
                                    return [2 /*return*/, msg];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, lmdb$$1.getRaw(soul)];
                            case 2:
                                rawResult = _a.sent();
                                put = 'null';
                                if (rawResult) {
                                    put = ['{', JSON.stringify(soul) + ": " + rawResult, '}'].join('');
                                }
                                raw = [
                                    '{',
                                    "\"#\": " + JSON.stringify(from.msgId()) + ",",
                                    "\"@\": " + JSON.stringify(dedupId) + ",",
                                    "\"put\": " + put,
                                    '}'
                                ].join('');
                                /*
                                const json = {
                                  '#': from.msgId(),
                                  '@': dedupId,
                                  put: result ? { [soul]: result } : null
                                }
                                */
                                from.send({
                                    raw: raw,
                                    // json,
                                    ignoreLeeching: true,
                                    skipValidation: !rawResult || skipValidation
                                });
                                return [2 /*return*/, disableRelay && rawResult ? __assign({}, msg, { noRelay: true }) : msg];
                            case 3:
                                err_1 = _a.sent();
                                console.error('get err', err_1.stack || err_1);
                                json_1 = {
                                    '#': from.msgId(),
                                    '@': dedupId,
                                    err: "" + err_1
                                };
                                from.send({ json: json_1, ignoreLeeching: true, skipValidation: skipValidation });
                                return [2 /*return*/, msg];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            });
            return db;
        };
    };
    var acceptWrites = function (Gun, _a, lmdbOpts) {
        var _b = (_a === void 0 ? {} : _a).disableRelay, disableRelay = _b === void 0 ? false : _b;
        if (lmdbOpts === void 0) { lmdbOpts = undefined; }
        return function (db) {
            var lmdb$$1 = (Gun.lmdb = db.lmdb = new GunLmdbClient(Gun, lmdbOpts));
            db.onIn(function gunLmdbAcceptWrites(msg) {
                return __awaiter(this, void 0, void 0, function () {
                    var diff, souls, json, err_2, json;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (msg.fromCluster || !msg.json.put)
                                    return [2 /*return*/, msg];
                                return [4 /*yield*/, db.getDiff(msg.json.put)];
                            case 1:
                                diff = _a.sent();
                                souls = diff && Object.keys(diff);
                                if (!souls || !souls.length) {
                                    return [2 /*return*/, disableRelay ? __assign({}, msg, { noRelay: true }) : msg];
                                }
                                _a.label = 2;
                            case 2:
                                _a.trys.push([2, 4, , 5]);
                                return [4 /*yield*/, lmdb$$1.write(diff)];
                            case 3:
                                _a.sent();
                                json = { '@': msg.json['#'], ok: true, err: null };
                                msg.from &&
                                    msg.from.send &&
                                    msg.from.send({
                                        json: json,
                                        noRelay: true,
                                        ignoreLeeching: true,
                                        skipValidation: true
                                    });
                                return [2 /*return*/, msg];
                            case 4:
                                err_2 = _a.sent();
                                console.error('error writing data', err_2);
                                json = { '@': msg.json['#'], ok: false, err: "" + err_2 };
                                msg.from &&
                                    msg.from.send &&
                                    msg.from.send({
                                        json: json,
                                        noRelay: disableRelay,
                                        ignoreLeeching: true,
                                        skipValidation: true
                                    });
                                return [2 /*return*/, msg];
                            case 5: return [2 /*return*/];
                        }
                    });
                });
            });
            return db;
        };
    };

    var receiverFns = /*#__PURE__*/Object.freeze({
        respondToGets: respondToGets,
        acceptWrites: acceptWrites
    });

    var attachToGun = function (Gun, options) {
        return Gun.on('create', function (db) {
            var lmdb$$1 = (Gun.lmdb = db.lmdb = new GunLmdbClient(Gun, options));
            db.on('get', function (request) {
                return __awaiter(this, void 0, void 0, function () {
                    var _a, dedupId, get, soul, result, err_1;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                this.to.next(request);
                                if (!request)
                                    return [2 /*return*/];
                                dedupId = request['#'];
                                get = request.get;
                                soul = get['#'];
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, lmdb$$1.get(soul)];
                            case 2:
                                result = _b.sent();
                                db.on('in', {
                                    '@': dedupId,
                                    put: result ? (_a = {}, _a[soul] = result, _a) : null,
                                    err: null
                                });
                                return [3 /*break*/, 4];
                            case 3:
                                err_1 = _b.sent();
                                console.error('error', err_1.stack || err_1);
                                db.on('in', {
                                    '@': dedupId,
                                    put: null,
                                    err: err_1
                                });
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            });
            db.on('put', function (request) {
                return __awaiter(this, void 0, void 0, function () {
                    var dedupId, err_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (!request)
                                    return [2 /*return*/, this.to.next(request)];
                                dedupId = request['#'];
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, lmdb$$1.write(request.put)];
                            case 2:
                                _a.sent();
                                db.on('in', {
                                    '@': dedupId,
                                    ok: true,
                                    err: null
                                });
                                return [3 /*break*/, 4];
                            case 3:
                                err_2 = _a.sent();
                                db.on('in', {
                                    '@': dedupId,
                                    ok: false,
                                    err: err_2
                                });
                                return [3 /*break*/, 4];
                            case 4:
                                this.to.next(request);
                                return [2 /*return*/];
                        }
                    });
                });
            });
            this.to.next(db);
        });
    };

    var receiver = receiverFns;

    exports.receiver = receiver;
    exports.attachToGun = attachToGun;
    exports.createClient = createClient;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=gun-lmdb.umd.js.map
