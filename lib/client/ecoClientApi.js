'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = __importStar(require("crypto"));
const request_promise_1 = __importDefault(require("request-promise"));
// @ts-ignore
const dateFormat = __importStar(require("date-format"));
class EcoClientApi {
    constructor(params) {
        this._tokenServer = '';
        this.refreshToken = () => __awaiter(this, void 0, void 0, function* () {
            let resultCall = yield this.getTokenServer();
            if (resultCall) {
                this._tokenServer = resultCall.token;
                this._dateToken = new Date();
            }
        });
        /**
         * checks if the token was generated, or if it was generated less than three hours ago
         * @return If token is valid
         */
        this.tokenIsValid = () => {
            if (!this._dateToken) {
                return false;
            }
            let dateCheck = new Date(this._dateToken.getFullYear(), this._dateToken.getMonth(), this._dateToken.getDate(), this._dateToken.getHours() - 3, this._dateToken.getHours(), this._dateToken.getSeconds());
            return this._dateToken.getTime() > dateCheck.getTime();
        };
        this.checkTokenAndGenerate = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.tokenIsValid()) {
                this._tokenServer = yield this.getTokenServer();
            }
            return !!this._tokenServer;
        });
        this.getTokenServer = () => {
            return request_promise_1.default.post(this._paramsEco.url, {
                oauth: {
                    consumer_key: this._paramsEco.consumerKey,
                    consumer_secret: this._paramsEco.consumerSecret,
                    token: this._paramsEco.accessToken,
                    token_secret: this._paramsEco.tokenSecret
                },
                form: this._paramsBody,
                json: true
            });
        };
        this.getProdutos = (urlEndPoint, filter) => __awaiter(this, void 0, void 0, function* () {
            // if (this._tokenServer.length === 0) {
            //     this._tokenServer = await this.getTokenServer()
            // }
            //
            // if (filter) {
            //     const urlRq = queryString.encode(filter)
            //     urlEndPoint += `?${urlRq}`
            // }
            //
            // this.get(urlEndPoint, {
            //     qsParseOptions: filter
            // })
            //
            // return request.get(urlEndPoint, {
            //         auth: {
            //             bearer: this._tokenServer
            //         },
            //         json: true,
            //     }
            // )
            return this.get('', { baseUrl: urlEndPoint, qs: filter, useQuerystring: true });
        });
        this.verbalizeFunc = (method) => {
            return (uri, filter) => __awaiter(this, void 0, void 0, function* () {
                if (!this.tokenIsValid()) {
                    yield this.refreshToken();
                }
                let params = request_promise_1.default.initParams(uri, filter);
                params.method = method.toUpperCase();
                params.auth = { bearer: this._tokenServer };
                params.json = true;
                return request_promise_1.default(params);
            });
        };
        this.get = this.verbalizeFunc('get');
        this.head = this.verbalizeFunc('head');
        this.options = this.verbalizeFunc('options');
        this.post = this.verbalizeFunc('post');
        this.put = this.verbalizeFunc('put');
        this.patch = this.verbalizeFunc('patch');
        this.del = this.verbalizeFunc('delete');
        this._paramsBody = initParamsBody(params);
        this._paramsEco = params;
    }
}
exports.EcoClientApi = EcoClientApi;
function initParamsBody(params) {
    const dateStr = dateFormat.asString('yyyy-MM-dd hh:mm:ss', new Date());
    // const dateStr = '2020-x04-02 17:33:11'
    let hashPreValidate = '';
    let hashValidadeCode = '';
    let hashUsuarioSenha = '';
    let hashSenhaValidate = '';
    hashPreValidate = crypto.createHash('sha1').update(params.idLocal + params.codigoValidacaoLocal).digest('base64');
    hashValidadeCode = crypto.createHash('sha1').update(dateStr + hashPreValidate).digest('base64');
    hashUsuarioSenha = crypto.createHash('sha1').update(params.usuarioEco + params.senhaEco).digest('hex');
    hashSenhaValidate = crypto.createHash('sha1').update(params.dbId + params.empresaEco + params.usuarioEco + hashUsuarioSenha + dateStr)
        .digest('base64');
    // console.log(hashPreValidate)
    // console.log(hashValidadeCode)
    // console.log(hashUsuarioSenha)
    // console.log(hashSenhaValidate)
    return {
        dbid: params.dbId,
        timestamp: dateStr,
        localid: params.idLocal,
        localcode: hashValidadeCode,
        empresa: params.empresaEco,
        usuario: params.usuarioEco,
        senha: hashSenhaValidate
    };
}
//# sourceMappingURL=ecoClientApi.js.map