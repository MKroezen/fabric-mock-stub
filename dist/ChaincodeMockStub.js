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
var queryEngine = require("@theledger/couchdb-query-engine");
var ChaincodeError_1 = require("./ChaincodeError");
var ChaincodeProposalCreator_1 = require("./ChaincodeProposalCreator");
var CompositeKeys_1 = require("./CompositeKeys");
var MockHistoryQueryIterator_1 = require("./MockHistoryQueryIterator");
var MockStateQueryIterator_1 = require("./MockStateQueryIterator");
var mockKeyModification_1 = require("./models/mockKeyModification");
var mockKeyValue_1 = require("./models/mockKeyValue");
var datatransform_1 = require("./utils/datatransform");
var helpers_1 = require("./utils/helpers");
var defaultUserCert = '-----BEGIN CERTIFICATE-----' +
    'MIIB6TCCAY+gAwIBAgIUHkmY6fRP0ANTvzaBwKCkMZZPUnUwCgYIKoZIzj0EAwIw' +
    'GzEZMBcGA1UEAxMQZmFicmljLWNhLXNlcnZlcjAeFw0xNzA5MDgwMzQyMDBaFw0x' +
    'ODA5MDgwMzQyMDBaMB4xHDAaBgNVBAMTE015VGVzdFVzZXJXaXRoQXR0cnMwWTAT' +
    'BgcqhkjOPQIBBggqhkjOPQMBBwNCAATmB1r3CdWvOOP3opB3DjJnW3CnN8q1ydiR' +
    'dzmuA6A2rXKzPIltHvYbbSqISZJubsy8gVL6GYgYXNdu69RzzFF5o4GtMIGqMA4G' +
    'A1UdDwEB/wQEAwICBDAMBgNVHRMBAf8EAjAAMB0GA1UdDgQWBBTYKLTAvJJK08OM' +
    'VGwIhjMQpo2DrjAfBgNVHSMEGDAWgBTEs/52DeLePPx1+65VhgTwu3/2ATAiBgNV' +
    'HREEGzAZghdBbmlscy1NYWNCb29rLVByby5sb2NhbDAmBggqAwQFBgcIAQQaeyJh' +
    'dHRycyI6eyJhdHRyMSI6InZhbDEifX0wCgYIKoZIzj0EAwIDSAAwRQIhAPuEqWUp' +
    'svTTvBqLR5JeQSctJuz3zaqGRqSs2iW+QB3FAiAIP0mGWKcgSGRMMBvaqaLytBYo' +
    '9v3hRt1r8j8vN0pMcg==' +
    '-----END CERTIFICATE-----';
var ChaincodeMockStub = /** @class */ (function () {
    /**
     * @param {string} name - Name of the mockstub
     * @param {ChaincodeInterface} cc - Your chaincode
     * @param {string} [usercert] - User creds certificate with/without attributes
     */
    function ChaincodeMockStub(name, cc, usercert) {
        if (usercert === void 0) { usercert = defaultUserCert; }
        this.name = name;
        this.cc = cc;
        this.usercert = usercert;
        this.txID = '';
        this.state = new Map();
        this.transientMap = new Map();
        this.privateCollections = new Map();
        this.event = new Map();
        this.history = new Map();
        this.invokables = new Map();
        this.mspId = 'dummymspId';
        this.stateValidation = new Map();
        this.privatedataValidation = new Map();
        this.logger = helpers_1.Helpers.getLoggerInstance(this.name);
    }
    /**
     * @returns {string}
     */
    ChaincodeMockStub.prototype.getTxID = function () {
        return this.txID;
    };
    /**
     * Get the current arguments
     *
     * @returns {string[]}
     */
    ChaincodeMockStub.prototype.getArgs = function () {
        return this.args;
    };
    ChaincodeMockStub.prototype.getSignedProposal = function () {
        return this.signedProposal;
    };
    ChaincodeMockStub.prototype.mockInvokeWithSignedProposal = function (uuid, args, sp) {
        this.setSignedProposal(sp);
        return this.mockInvoke(uuid, args);
    };
    ChaincodeMockStub.prototype.setSignedProposal = function (sp) {
        this.signedProposal = sp;
    };
    /**
     * Same as getArgs()
     *
     * @returns {string[]}
     */
    ChaincodeMockStub.prototype.getStringArgs = function () {
        return this.args;
    };
    /**
     * @returns {{params: string[]; fcn: string}}
     */
    ChaincodeMockStub.prototype.getFunctionAndParameters = function () {
        var params = this.getStringArgs();
        var fcn = '';
        if (params.length >= 1) {
            fcn = params[0];
            params.splice(0, 1);
        }
        return {
            fcn: fcn,
            params: params,
        };
    };
    /**
     * Used to indicate to a chaincode that it is part of a transaction.
     * This is important when chaincodes invoke each other.
     * MockStub doesn't support concurrent transactions at present.
     *
     * @param {string} txid
     * @param transientMap
     */
    ChaincodeMockStub.prototype.mockTransactionStart = function (txid, transientMap) {
        this.txID = txid;
        this.setChaincodeProposal({});
        this.transientMap = transientMap;
    };
    /**
     * End a mocked transaction, clearing the UUID.
     *
     * @param {string} uuid
     */
    ChaincodeMockStub.prototype.mockTransactionEnd = function (uuid) {
        this.signedProposal = null;
        this.txID = '';
        this.transientMap = new Map();
    };
    /**
     * Register a peer chaincode with this MockStub
     * invokableChaincodeName is the name or hash of the peer
     * otherStub is a MockStub of the peer, already intialised
     *
     * @param {string} invokableChaincodeName
     * @param {"fabric-shim".MockStub} otherStub
     */
    ChaincodeMockStub.prototype.mockPeerChaincode = function (invokableChaincodeName, otherStub) {
        this.invokables[invokableChaincodeName] = otherStub;
    };
    /**
     * Initialise this chaincode,  also starts and ends a transaction.
     *
     * @param {string} uuid
     * @param {string[]} args
     * @param transientMap
     * @returns {Promise<"fabric-shim".ChaincodeResponse>}
     */
    ChaincodeMockStub.prototype.mockInit = function (uuid, args, transientMap) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.args = args;
                        this.mockTransactionStart(uuid, transientMap);
                        return [4 /*yield*/, this.cc.Init(this)];
                    case 1:
                        res = _a.sent();
                        this.mockTransactionEnd(uuid);
                        return [2 /*return*/, res];
                }
            });
        });
    };
    /**
     * Invoke this chaincode, also starts and ends a transaction.
     *
     * @param {string} uuid
     * @param {string[]} args
     * @param transientMap
     * @returns {Promise<"fabric-shim".ChaincodeResponse>}
     */
    ChaincodeMockStub.prototype.mockInvoke = function (uuid, args, transientMap) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.args = args;
                        this.mockTransactionStart(uuid, transientMap);
                        return [4 /*yield*/, this.cc.Invoke(this)];
                    case 1:
                        res = _a.sent();
                        this.mockTransactionEnd(uuid);
                        return [2 /*return*/, res];
                }
            });
        });
    };
    /**
     * InvokeChaincode calls a peered chaincode.
     *
     * @param {string} chaincodeName
     * @param {Buffer[]} args
     * @param {string} channel
     * @returns {Promise<"fabric-shim".ChaincodeResponse>}
     */
    ChaincodeMockStub.prototype.invokeChaincode = function (chaincodeName, args, channel) {
        return __awaiter(this, void 0, void 0, function () {
            var otherStub;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Internally we use chaincode name as a composite name
                        if (channel != '') {
                            chaincodeName = chaincodeName + '/' + channel;
                        }
                        otherStub = this.invokables[chaincodeName];
                        if (!otherStub) {
                            throw new Error("Chaincode " + chaincodeName + " could not be found. Please create this using mockPeerChaincode.");
                        }
                        return [4 /*yield*/, otherStub.mockInvoke(this.txID, args)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Invoke this chaincode, also starts and ends a transaction.
     *
     * @param {string} uuid
     * @param {string[]} args
     * @param {"fabric-shim".ChaincodeProposal.SignedProposal} sp
     * @returns {Promise<"fabric-shim".ChaincodeResponse>}
     */
    ChaincodeMockStub.prototype.mockInvokeWithChaincodeProposal = function (uuid, args, sp) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.args = args;
                        this.mockTransactionStart(uuid);
                        this.signedProposal = sp;
                        return [4 /*yield*/, this.cc.Invoke(this)];
                    case 1:
                        res = _a.sent();
                        this.mockTransactionEnd(uuid);
                        return [2 /*return*/, res];
                }
            });
        });
    };
    /**
     * Get a stored value for this key in the local state
     *
     * @param {string} key
     * @returns {Promise<Buffer>}
     */
    ChaincodeMockStub.prototype.getState = function (key) {
        if (!this.state[key]) {
            return Promise.resolve(Buffer.from(''));
        }
        return Promise.resolve(this.state[key]);
    };
    /**
     * Store a value for this key in the local state
     *
     * @param {string} key
     * @param value
     * @returns {Promise<Buffer>}
     */
    ChaincodeMockStub.prototype.putState = function (key, value) {
        if (this.txID == '') {
            return Promise.reject(new Error('Cannot putState without a transaction - call stub.mockTransactionStart()!'));
        }
        this.state[key] = value;
        if (!this.history[key]) {
            this.history[key] = [];
        }
        this.history[key].push(new mockKeyModification_1.MockKeyModification(false, value, this.txID));
        return Promise.resolve();
    };
    /**
     * DelState removes the specified `key` and its value from the ledger.
     *
     * @param {string} key
     * @returns {Promise<any>}
     */
    ChaincodeMockStub.prototype.deleteState = function (key) {
        var value = this.state[key];
        this.history[key].push(new mockKeyModification_1.MockKeyModification(true, value, this.txID));
        delete this.state[key];
        return Promise.resolve();
    };
    /**
     * Get state by range of keys, empty keys will return everything
     *
     * @param {string} startKey
     * @param {string} endKey
     * @returns {Promise<"fabric-shim".Iterators.StateQueryIterator>}
     */
    ChaincodeMockStub.prototype.getStateByRange = function (startKey, endKey) {
        var _this = this;
        var items = Object.keys(this.state)
            .filter(function (k) {
            var comp1 = helpers_1.Helpers.strcmp(k, startKey);
            var comp2 = helpers_1.Helpers.strcmp(k, endKey);
            return (comp1 >= 0 && comp2 <= 0) || (startKey == '' && endKey == '');
        })
            .map(function (k) { return new mockKeyValue_1.MockKeyValue(k, _this.state[k]); });
        return Promise.resolve(new MockStateQueryIterator_1.MockStateQueryIterator(items, this.txID));
    };
    // tslint:disable-next-line:max-line-length
    ChaincodeMockStub.prototype.getStateByRangeWithPagination = function (startKey, endKey, pageSize, bookmark) {
        return __awaiter(this, void 0, void 0, function () {
            var iterator, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getStateByRange(startKey, endKey)];
                    case 1:
                        iterator = _a.sent();
                        return [2 /*return*/, Promise.resolve(this.paginate(iterator, pageSize, bookmark))];
                    case 2:
                        err_1 = _a.sent();
                        throw err_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * GetQueryResult function can be invoked by a chaincode to perform a
     * rich query against state database.  Only supported by state database implementations
     * that support rich query.  The query string is in the syntax of the underlying
     * state database. An iterator is returned which can be used to iterate (next) over
     * the query result set.
     *
     * Blog post on writing rich queries -
     * https://medium.com/wearetheledger/hyperledger-fabric-couchdb-fantastic-queries-and-where-to-find-them-f8a3aecef767
     *
     * @param {string} query
     * @returns {Promise<"fabric-shim".Iterators.StateQueryIterator>}
     */
    ChaincodeMockStub.prototype.getQueryResult = function (query) {
        var _this = this;
        var keyValues = {};
        Object.keys(this.state)
            .forEach(function (k) {
            keyValues[k] = datatransform_1.Transform.bufferToObject(_this.state[k]);
        });
        var parsedQuery;
        try {
            parsedQuery = JSON.parse(query);
        }
        catch (err) {
            throw new ChaincodeError_1.ChaincodeError('Error parsing query, should be string');
        }
        if (parsedQuery.sort) {
            this.logger.warn('Sorting might work using the mockstub, but on a live network you need to add an index to CouchDB');
        }
        var items = queryEngine.parseQuery(keyValues, parsedQuery)
            .map(function (item) { return new mockKeyValue_1.MockKeyValue(item.key, datatransform_1.Transform.serialize(item.value)); });
        return Promise.resolve(new MockStateQueryIterator_1.MockStateQueryIterator(items, this.txID));
    };
    // tslint:disable-next-line:max-line-length
    ChaincodeMockStub.prototype.getQueryResultWithPagination = function (query, pageSize, bookmark) {
        return __awaiter(this, void 0, void 0, function () {
            var iterator, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getQueryResult(query)];
                    case 1:
                        iterator = _a.sent();
                        return [2 /*return*/, this.paginate(iterator, pageSize, bookmark)];
                    case 2:
                        err_2 = _a.sent();
                        throw err_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieve state by partial keys
     *
     * @param {string} objectType
     * @param {string[]} attributes
     * @returns {Promise<"fabric-shim".Iterators.StateQueryIterator>}
     */
    ChaincodeMockStub.prototype.getStateByPartialCompositeKey = function (objectType, attributes) {
        var partialCompositeKey = CompositeKeys_1.CompositeKeys.createCompositeKey(objectType, attributes);
        return this.getStateByRange(partialCompositeKey, partialCompositeKey + CompositeKeys_1.CompositeKeys.MAX_UNICODE_RUNE_VALUE);
    };
    // tslint:disable-next-line:max-line-length
    ChaincodeMockStub.prototype.getStateByPartialCompositeKeyWithPagination = function (objectType, attributes, pageSize, bookmark) {
        return __awaiter(this, void 0, void 0, function () {
            var iterator, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getStateByPartialCompositeKey(objectType, attributes)];
                    case 1:
                        iterator = _a.sent();
                        return [2 /*return*/, this.paginate(iterator, pageSize, bookmark)];
                    case 2:
                        err_3 = _a.sent();
                        throw err_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ChaincodeMockStub.prototype.createCompositeKey = function (objectType, attributes) {
        return CompositeKeys_1.CompositeKeys.createCompositeKey(objectType, attributes);
    };
    ChaincodeMockStub.prototype.splitCompositeKey = function (compositeKey) {
        return CompositeKeys_1.CompositeKeys.splitCompositeKey(compositeKey);
    };
    ChaincodeMockStub.prototype.getChaincodeProposal = function () {
        return this.signedProposal;
    };
    ChaincodeMockStub.prototype.setChaincodeProposal = function (sp) {
        this.signedProposal = sp;
    };
    ChaincodeMockStub.prototype.setTxTimestamp = function (t) {
        this.txTimestamp = t;
    };
    ChaincodeMockStub.prototype.getTxTimestamp = function () {
        if (this.txTimestamp == null) {
            throw new Error('TxTimestamp not set.');
        }
        return this.txTimestamp;
    };
    /**
     * Store a mspId of the transaction's creator
     *
     * @param {string} mspId
     * @returns {void}
     */
    ChaincodeMockStub.prototype.setCreator = function (mspId) {
        this.mspId = mspId;
    };
    ChaincodeMockStub.prototype.getCreator = function () {
        return new ChaincodeProposalCreator_1.ChaincodeProposalCreator(this.mspId, this.usercert);
    };
    /**
     * GetHistory for key
     *
     * @param {string} key
     * @returns {Promise<"fabric-shim".Iterators.HistoryQueryIterator>}
     */
    ChaincodeMockStub.prototype.getHistoryForKey = function (key) {
        return Promise.resolve(new MockHistoryQueryIterator_1.MockHistoryQueryIterator(this.history[key], this.txID));
    };
    /**
     * @todo Implement
     * @returns {string}
     */
    ChaincodeMockStub.prototype.getBinding = function () {
        return undefined;
    };
    /**
     * Returns mocked transient values. These need to be set using the mockInvoke or mockTransactionStart
     *
     * @returns {Map<string, Buffer>}
     */
    ChaincodeMockStub.prototype.getTransient = function () {
        return this.transientMap;
    };
    /**
     * Store the payload corresponding to an event name to the local event map
     *
     * @param {string} name
     * @param {Buffer} payload
     */
    ChaincodeMockStub.prototype.setEvent = function (name, payload) {
        if (this.txID == '') {
            return Promise.reject(new Error('Cannot putState without a transaction - call stub.mockTransactionStart()!'));
        }
        this.event[name] = payload;
        return Promise.resolve();
    };
    /**
     * Get the stored payload for an event name in the local event map
     *
     * @returns {Promise<Buffer>}
     * @param name
     */
    ChaincodeMockStub.prototype.getEvent = function (name) {
        return this.event[name];
    };
    /**
     * @todo Implement
     *
     * @returns {string}
     */
    ChaincodeMockStub.prototype.getChannelID = function () {
        return undefined;
    };
    /**
     * Get a stored value for this key in the local state
     *
     * @param collection
     * @param {string} key
     * @returns {Promise<Buffer>}
     */
    ChaincodeMockStub.prototype.getPrivateData = function (collection, key) {
        return (this.privateCollections[collection] || {})[key];
    };
    /**
     * Store a value for this key in the local state
     *
     * @param collection
     * @param {string} key
     * @param value
     * @returns {Promise<Buffer>}
     */
    ChaincodeMockStub.prototype.putPrivateData = function (collection, key, value) {
        if (this.txID == '') {
            return Promise.reject('Cannot putState without a transaction - call stub.mockTransactionStart()!');
        }
        if (!this.privateCollections[collection]) {
            this.privateCollections[collection] = new Map();
        }
        this.privateCollections[collection][key] = value;
        return Promise.resolve();
    };
    /**
     * DelState removes the specified `key` and its value from the ledger.
     *
     * @param collection
     * @param {string} key
     * @returns {Promise<any>}
     */
    ChaincodeMockStub.prototype.deletePrivateData = function (collection, key) {
        var value = (this.privateCollections[collection] || {})[key];
        if (value) {
            this.privateCollections[collection].delete(key);
        }
        return Promise.resolve();
    };
    /**
     * Get state by range of keys, empty keys will return everything
     *
     * @param collection
     * @param {string} startKey
     * @param {string} endKey
     * @returns {Promise<"fabric-shim".Iterators.StateQueryIterator>}
     */
    ChaincodeMockStub.prototype.getPrivateDataByRange = function (collection, startKey, endKey) {
        var privateCollection = this.privateCollections[collection] || {};
        var items = Object.keys(privateCollection)
            .filter(function (k) {
            var comp1 = helpers_1.Helpers.strcmp(k, startKey);
            var comp2 = helpers_1.Helpers.strcmp(k, endKey);
            return (comp1 >= 0 && comp2 <= 0) || (startKey == '' && endKey == '');
        })
            .map(function (k) { return new mockKeyValue_1.MockKeyValue(k, privateCollection[k]); });
        return Promise.resolve(new MockStateQueryIterator_1.MockStateQueryIterator(items, this.txID));
    };
    /**
     *
     * GetQueryResult function can be invoked by a chaincode to perform a
     * rich query against state database.  Only supported by state database implementations
     * that support rich query.  The query string is in the syntax of the underlying
     * state database. An iterator is returned which can be used to iterate (next) over
     * the query result set.
     *
     * Blog post on writing rich queries -
     * https://medium.com/wearetheledger/hyperledger-fabric-couchdb-fantastic-queries-and-where-to-find-them-f8a3aecef767
     *
     * @param collection
     * @param {string} query
     * @returns {Promise<"fabric-shim".Iterators.StateQueryIterator>}
     */
    ChaincodeMockStub.prototype.getPrivateDataQueryResult = function (collection, query) {
        var privateCollection = this.privateCollections[collection] || {};
        var keyValues = {};
        Object.keys(privateCollection)
            .forEach(function (k) {
            keyValues[k] = datatransform_1.Transform.bufferToObject(privateCollection[k]);
        });
        var parsedQuery;
        try {
            parsedQuery = JSON.parse(query);
        }
        catch (err) {
            throw new ChaincodeError_1.ChaincodeError('Error parsing query, should be string');
        }
        if (parsedQuery.sort) {
            this.logger.warn('Sorting might work using the mockstub, but on a live network you need to add an index' +
                ' to CouchDB. More info can be found here: http://hyperledger-fabric.readthedocs.io/en/release-1.1/' +
                'couchdb_as_state_database.html#using-couchdb-from-chaincode');
        }
        var items = queryEngine.parseQuery(keyValues, parsedQuery)
            .map(function (item) { return new mockKeyValue_1.MockKeyValue(item.key, datatransform_1.Transform.serialize(item.value)); });
        return Promise.resolve(new MockStateQueryIterator_1.MockStateQueryIterator(items, this.txID));
    };
    ChaincodeMockStub.prototype.setStateValidationParameter = function (key, ep) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.stateValidation[key] = ep;
                this.logger.warn('Due to the complexity of endorsement policies, in our mockstub, we do not enforce the actual polcies on the mocked state.');
                return [2 /*return*/];
            });
        });
    };
    ChaincodeMockStub.prototype.getStateValidationParameter = function (key) {
        if (!this.stateValidation[key]) {
            return Promise.resolve(Buffer.from(''));
        }
        return Promise.resolve(this.stateValidation[key]);
    };
    ChaincodeMockStub.prototype.setPrivateDataValidationParameter = function (collection, key, ep) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.privatedataValidation[collection]) {
                    this.privatedataValidation[collection] = new Map();
                }
                this.logger.warn('Due to the complexity of endorsement policies, in our mockstub, we do not enforce the actual polcies on the mocked state.');
                this.privatedataValidation[collection][key] = ep;
                return [2 /*return*/];
            });
        });
    };
    ChaincodeMockStub.prototype.getPrivateDataValidationParameter = function (collection, key) {
        return __awaiter(this, void 0, void 0, function () {
            var policy;
            return __generator(this, function (_a) {
                policy = (this.privateCollections[collection] || {})[key];
                if (!policy) {
                    return [2 /*return*/, Promise.resolve(Buffer.from(''))];
                }
                return [2 /*return*/, Promise.resolve(policy)];
            });
        });
    };
    ChaincodeMockStub.prototype.getPrivateDataByPartialCompositeKey = function (collection, objectType, attributes) {
        var partialCompositeKey = CompositeKeys_1.CompositeKeys.createCompositeKey(objectType, attributes);
        return this.getPrivateDataByRange(collection, partialCompositeKey, partialCompositeKey + CompositeKeys_1.CompositeKeys.MAX_UNICODE_RUNE_VALUE);
    };
    ChaincodeMockStub.prototype.paginate = function (iterator, pageSize, bookmark) {
        var items = iterator.response.results;
        var start = bookmark ? parseInt(bookmark) * pageSize : 0;
        var pagedItems = items.slice(start, start + pageSize);
        return {
            iterator: new MockStateQueryIterator_1.MockStateQueryIterator(pagedItems, this.txID),
            metadata: {
                fetched_records_count: items.length,
                bookmark: "" + ((start / pageSize) + 1)
            }
        };
    };
    return ChaincodeMockStub;
}());
exports.ChaincodeMockStub = ChaincodeMockStub;
//# sourceMappingURL=ChaincodeMockStub.js.map