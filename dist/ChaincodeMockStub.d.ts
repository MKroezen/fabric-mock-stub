import { ChaincodeInterface, ChaincodeProposal, ChaincodeResponse, ChaincodeStub, Iterators, SplitCompositekey, StateQueryResponse } from 'fabric-shim';
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';
import { MockStub } from '.';
import { ChaincodeProposalCreator } from './ChaincodeProposalCreator';
/**
 * Mock implementation of the fabric-shim stub
 */
export declare type StateMap = Map<string, Buffer>;
export declare class ChaincodeMockStub implements MockStub, ChaincodeStub {
    private name;
    private cc;
    private usercert;
    private logger;
    private txTimestamp;
    private txID;
    private args;
    state: StateMap;
    transientMap: StateMap;
    privateCollections: Map<string, StateMap>;
    event: Map<string, Buffer>;
    history: Map<string, Iterators.KeyModification[]>;
    private invokables;
    private signedProposal;
    private mspId;
    stateValidation: StateMap;
    privatedataValidation: Map<string, StateMap>;
    /**
     * @param {string} name - Name of the mockstub
     * @param {ChaincodeInterface} cc - Your chaincode
     * @param {string} [usercert] - User creds certificate with/without attributes
     */
    constructor(name: string, cc: ChaincodeInterface, usercert?: string);
    /**
     * @returns {string}
     */
    getTxID(): string;
    /**
     * Get the current arguments
     *
     * @returns {string[]}
     */
    getArgs(): string[];
    getSignedProposal(): ChaincodeProposal.SignedProposal;
    mockInvokeWithSignedProposal(uuid: string, args: string[], sp: ChaincodeProposal.SignedProposal): Promise<ChaincodeResponse>;
    setSignedProposal(sp: ChaincodeProposal.SignedProposal): void;
    /**
     * Same as getArgs()
     *
     * @returns {string[]}
     */
    getStringArgs(): string[];
    /**
     * @returns {{params: string[]; fcn: string}}
     */
    getFunctionAndParameters(): {
        params: string[];
        fcn: string;
    };
    /**
     * Used to indicate to a chaincode that it is part of a transaction.
     * This is important when chaincodes invoke each other.
     * MockStub doesn't support concurrent transactions at present.
     *
     * @param {string} txid
     * @param transientMap
     */
    mockTransactionStart(txid: string, transientMap?: StateMap): void;
    /**
     * End a mocked transaction, clearing the UUID.
     *
     * @param {string} uuid
     */
    mockTransactionEnd(uuid: string): void;
    /**
     * Register a peer chaincode with this MockStub
     * invokableChaincodeName is the name or hash of the peer
     * otherStub is a MockStub of the peer, already intialised
     *
     * @param {string} invokableChaincodeName
     * @param {"fabric-shim".MockStub} otherStub
     */
    mockPeerChaincode(invokableChaincodeName: string, otherStub: MockStub): void;
    /**
     * Initialise this chaincode,  also starts and ends a transaction.
     *
     * @param {string} uuid
     * @param {string[]} args
     * @param transientMap
     * @returns {Promise<"fabric-shim".ChaincodeResponse>}
     */
    mockInit(uuid: string, args: string[], transientMap?: StateMap): Promise<ChaincodeResponse>;
    /**
     * Invoke this chaincode, also starts and ends a transaction.
     *
     * @param {string} uuid
     * @param {string[]} args
     * @param transientMap
     * @returns {Promise<"fabric-shim".ChaincodeResponse>}
     */
    mockInvoke(uuid: string, args: string[], transientMap?: StateMap): Promise<ChaincodeResponse>;
    /**
     * InvokeChaincode calls a peered chaincode.
     *
     * @param {string} chaincodeName
     * @param {Buffer[]} args
     * @param {string} channel
     * @returns {Promise<"fabric-shim".ChaincodeResponse>}
     */
    invokeChaincode(chaincodeName: string, args: string[], channel: string): Promise<ChaincodeResponse>;
    /**
     * Invoke this chaincode, also starts and ends a transaction.
     *
     * @param {string} uuid
     * @param {string[]} args
     * @param {"fabric-shim".ChaincodeProposal.SignedProposal} sp
     * @returns {Promise<"fabric-shim".ChaincodeResponse>}
     */
    mockInvokeWithChaincodeProposal(uuid: string, args: string[], sp: ChaincodeProposal.SignedProposal): Promise<ChaincodeResponse>;
    /**
     * Get a stored value for this key in the local state
     *
     * @param {string} key
     * @returns {Promise<Buffer>}
     */
    getState(key: string): Promise<Buffer>;
    /**
     * Store a value for this key in the local state
     *
     * @param {string} key
     * @param value
     * @returns {Promise<Buffer>}
     */
    putState(key: string, value: Buffer): Promise<any>;
    /**
     * DelState removes the specified `key` and its value from the ledger.
     *
     * @param {string} key
     * @returns {Promise<any>}
     */
    deleteState(key: string): Promise<any>;
    /**
     * Get state by range of keys, empty keys will return everything
     *
     * @param {string} startKey
     * @param {string} endKey
     * @returns {Promise<"fabric-shim".Iterators.StateQueryIterator>}
     */
    getStateByRange(startKey: string, endKey: string): Promise<Iterators.StateQueryIterator>;
    getStateByRangeWithPagination(startKey: string, endKey: string, pageSize: number, bookmark?: string): Promise<StateQueryResponse<Iterators.StateQueryIterator>>;
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
    getQueryResult(query: string): Promise<Iterators.StateQueryIterator>;
    getQueryResultWithPagination(query: string, pageSize: number, bookmark?: string): Promise<StateQueryResponse<Iterators.StateQueryIterator>>;
    /**
     * Retrieve state by partial keys
     *
     * @param {string} objectType
     * @param {string[]} attributes
     * @returns {Promise<"fabric-shim".Iterators.StateQueryIterator>}
     */
    getStateByPartialCompositeKey(objectType: string, attributes: string[]): Promise<Iterators.StateQueryIterator>;
    getStateByPartialCompositeKeyWithPagination(objectType: string, attributes: string[], pageSize: number, bookmark?: string): Promise<StateQueryResponse<Iterators.StateQueryIterator>>;
    createCompositeKey(objectType: string, attributes: string[]): string;
    splitCompositeKey(compositeKey: string): SplitCompositekey;
    getChaincodeProposal(): ChaincodeProposal.SignedProposal;
    setChaincodeProposal(sp: ChaincodeProposal.SignedProposal): void;
    setTxTimestamp(t: Timestamp): void;
    getTxTimestamp(): Timestamp;
    /**
     * Store a mspId of the transaction's creator
     *
     * @param {string} mspId
     * @returns {void}
     */
    setCreator(mspId: string): void;
    getCreator(): ChaincodeProposalCreator;
    /**
     * GetHistory for key
     *
     * @param {string} key
     * @returns {Promise<"fabric-shim".Iterators.HistoryQueryIterator>}
     */
    getHistoryForKey(key: string): Promise<Iterators.HistoryQueryIterator>;
    /**
     * @todo Implement
     * @returns {string}
     */
    getBinding(): string;
    /**
     * Returns mocked transient values. These need to be set using the mockInvoke or mockTransactionStart
     *
     * @returns {Map<string, Buffer>}
     */
    getTransient(): StateMap;
    /**
     * Store the payload corresponding to an event name to the local event map
     *
     * @param {string} name
     * @param {Buffer} payload
     */
    setEvent(name: string, payload: Buffer): Promise<any>;
    /**
     * Get the stored payload for an event name in the local event map
     *
     * @returns {Promise<Buffer>}
     * @param name
     */
    getEvent(name: string): Promise<Buffer>;
    /**
     * @todo Implement
     *
     * @returns {string}
     */
    getChannelID(): string;
    /**
     * Get a stored value for this key in the local state
     *
     * @param collection
     * @param {string} key
     * @returns {Promise<Buffer>}
     */
    getPrivateData(collection: string, key: string): Promise<Buffer>;
    /**
     * Store a value for this key in the local state
     *
     * @param collection
     * @param {string} key
     * @param value
     * @returns {Promise<Buffer>}
     */
    putPrivateData(collection: string, key: string, value: Buffer): Promise<any>;
    /**
     * DelState removes the specified `key` and its value from the ledger.
     *
     * @param collection
     * @param {string} key
     * @returns {Promise<any>}
     */
    deletePrivateData(collection: string, key: string): Promise<any>;
    /**
     * Get state by range of keys, empty keys will return everything
     *
     * @param collection
     * @param {string} startKey
     * @param {string} endKey
     * @returns {Promise<"fabric-shim".Iterators.StateQueryIterator>}
     */
    getPrivateDataByRange(collection: string, startKey: string, endKey: string): Promise<Iterators.StateQueryIterator>;
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
    getPrivateDataQueryResult(collection: string, query: string): Promise<Iterators.StateQueryIterator>;
    setStateValidationParameter(key: string, ep: Buffer): Promise<void>;
    getStateValidationParameter(key: string): Promise<Buffer>;
    setPrivateDataValidationParameter(collection: string, key: string, ep: Buffer): Promise<void>;
    getPrivateDataValidationParameter(collection: string, key: string): Promise<Buffer>;
    getPrivateDataByPartialCompositeKey(collection: string, objectType: string, attributes: string[]): Promise<Iterators.StateQueryIterator>;
    private paginate;
}
