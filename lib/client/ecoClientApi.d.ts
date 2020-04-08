import { EcoParams } from './eco-params';
import request from 'request-promise';
import { EcoFilterService } from './eco-filter-service';
export declare class EcoClientApi {
    private readonly _paramsBody;
    private _paramsEco;
    private _tokenServer;
    private _dateToken?;
    constructor(params: EcoParams);
    refreshToken: () => Promise<void>;
    /**
     * checks if the token was generated, or if it was generated less than three hours ago
     * @return If token is valid
     */
    tokenIsValid: () => boolean;
    checkTokenAndGenerate: () => Promise<boolean>;
    getTokenServer: () => request.RequestPromise<string>;
    getProdutos: (urlEndPoint: string, filter: EcoFilterService) => Promise<request.RequestPromise<[]>>;
    private verbalizeFunc;
    get: (uri: string, filter?: request.RequestPromiseOptions | undefined) => Promise<any>;
    head: (uri: string, filter?: request.RequestPromiseOptions | undefined) => Promise<any>;
    options: (uri: string, filter?: request.RequestPromiseOptions | undefined) => Promise<any>;
    post: (uri: string, filter?: request.RequestPromiseOptions | undefined) => Promise<any>;
    put: (uri: string, filter?: request.RequestPromiseOptions | undefined) => Promise<any>;
    patch: (uri: string, filter?: request.RequestPromiseOptions | undefined) => Promise<any>;
    del: (uri: string, filter?: request.RequestPromiseOptions | undefined) => Promise<any>;
}
