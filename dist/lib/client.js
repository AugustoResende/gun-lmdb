"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
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
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_lmdb_1 = require("node-lmdb");
var DEFAULT_CONFIG = {
    path: 'lmdb'
};
var GunLmdbClient = /** @class */ (function () {
    function GunLmdbClient(Gun, lmdbConfig) {
        if (lmdbConfig === void 0) { lmdbConfig = DEFAULT_CONFIG; }
        this.Gun = Gun;
        this.env = new node_lmdb_1.default.Env();
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
exports.GunLmdbClient = GunLmdbClient;
function createClient(Gun, options) {
    return new GunLmdbClient(Gun, options);
}
exports.createClient = createClient;
//# sourceMappingURL=client.js.map