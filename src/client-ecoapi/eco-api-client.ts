'use strict'

import { EcoApiParams } from './eco-api-params'
import { EcoApiParamsBody } from './eco-api-params-body'
import * as crypto from 'crypto'
import request, { RequestPromise, RequestPromiseOptions } from 'request-promise'
import { EcoApiParamsOptions } from './eco-api-params-options'
// @ts-ignore
import * as dateFormat from 'date-format'


/**
 * Classe para criação de um client para fazer requisições REST para o servidor do Sistema ECO API
 */
export class EcoApiClient {

    private readonly _paramsBody: EcoApiParamsBody
    private _paramsEco: EcoApiParams
    private _tokenServer: string = ''
    private _dateToken?: Date

    constructor(params: EcoApiParams) {
        this._paramsBody = initParamsBody(params)
        this._paramsEco = params
    }

    /**
     * Renova o Token de acesso para os endpoints dos serviços
     */
    refreshToken = async() => {
        let resultCall: any = await this.getTokenServer()

        if (resultCall) {
            this._tokenServer = resultCall.token
            this._dateToken = new Date()
        }

    }

    /**
     * checks if the token was generated, or if it was generated less than three hours ago
     * @return If token is valid
     */
    tokenIsValid = (): boolean => {
        if (!this._dateToken) {
            return false
        }

        let dateCheck = new Date(this._dateToken.getFullYear(),
            this._dateToken.getMonth(),
            this._dateToken.getDate(),
            this._dateToken.getHours() - 3,
            this._dateToken.getHours(),
            this._dateToken.getSeconds())

        return this._dateToken.getTime() > dateCheck.getTime()
    }

    checkTokenAndGenerate = async(): Promise<boolean> => {
        if (!this.tokenIsValid()) {
            this._tokenServer = await this.getTokenServer()
        }

        return !!this._tokenServer
    }

    /**
     * Carre o token de acesso aos endpoints dos serviços do Sistema ECO API atraves do OAuth 1.0
     */
    getTokenServer = (): RequestPromise<string> => {
        return request.post(this._paramsEco.url, {
            oauth: {
                consumer_key: this._paramsEco.consumerKey,
                consumer_secret: this._paramsEco.consumerSecret,
                token: this._paramsEco.accessToken,
                token_secret: this._paramsEco.tokenSecret
            },
            form: this._paramsBody,
            json: true
        })
    }

    /**
     * Carrega as informações dos produtos do Sistema ECO API
     * @param urlEndPoint URL do endponint para carregas as informações dos produtos
     * @param filter Fitro para pesquisa no serviço de produtos no Servidor ECO API
     */
    getProdutos = (urlEndPoint: string, filter: EcoApiParamsOptions): Promise<RequestPromise<[]>> => {
        return this.get('', { baseUrl: urlEndPoint, qs: filter, useQuerystring: true, resolveWithFullResponse: true })
    }

    /**
     * Verbaliza as chamadas REST como post, get, path, etc. pois todas as chamadas são identificas, a unica coisa
     * que muda de um para outra é o HEADER METHOD
     * @param method
     */
    private verbalizeFunc = (method: string) => {
        return async(uri: string, options?: RequestPromiseOptions, body?:any) => {
            if (!this.tokenIsValid()) {
                await this.refreshToken()
            }

            let params = request.initParams(uri, options)
            params.method = method.toUpperCase()
            params.auth = { bearer: this._tokenServer }
            params.body = body
            params.json = true
            return request(params)
        }
    }

    get = this.verbalizeFunc('get')
    head = this.verbalizeFunc('head')
    options = this.verbalizeFunc('options')
    post = this.verbalizeFunc('post')
    put = this.verbalizeFunc('put')
    patch = this.verbalizeFunc('patch')
    del = this.verbalizeFunc('delete')
}

/**
 * Inicia os parametros do Body obrigatório para fazer um request no Servidor ECO API com o OAuth 1.0
 * @param params Parametros obrigátorio para fazer o Body do Request para pegar o Token
 */
function initParamsBody(params: EcoApiParams): EcoApiParamsBody {
    const dateStr = dateFormat.asString('yyyy-MM-dd hh:mm:ss', new Date())
    let hashPreValidate: string
    let hashValidadeCode: string
    let hashUsuarioSenha: string
    let hashSenhaValidate: string

    hashPreValidate = crypto.createHash('sha1').update(params.idLocal + params.codigoValidacaoLocal).digest('base64')
    hashValidadeCode = crypto.createHash('sha1').update(dateStr + hashPreValidate).digest('base64')
    hashUsuarioSenha = crypto.createHash('sha1').update(params.usuarioEco + params.senhaEco).digest('hex')
    hashSenhaValidate = crypto.createHash('sha1').update(params.dbId + params.empresaEco + params.usuarioEco + hashUsuarioSenha + dateStr)
        .digest('base64')

    return {
        dbid: params.dbId,
        timestamp: dateStr,
        localid: params.idLocal,
        localcode: hashValidadeCode,
        empresa: params.empresaEco,
        usuario: params.usuarioEco,
        senha: hashSenhaValidate
    }
}


