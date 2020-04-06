'use strict'

import { EcoParams } from './eco-params'
import { EcoParamsBody } from './eco-params-body'
import * as crypto from 'crypto'
import request from 'request-promise'
import * as queryString from 'querystring'
// @ts-ignore
import * as dateFormat from 'date-format'
import { RequestPromise, RequestPromiseOptions } from 'request-promise'
import { RequestCallback } from 'request'
import { EcoFilterService } from './eco-filter-service'


export class EcoClientApi {

    private readonly _paramsBody: EcoParamsBody
    private _paramsEco: EcoParams
    private _tokenServer: string = ''
    private _dateToken?: Date

    constructor(params: EcoParams) {
        this._paramsBody = initParamsBody(params)
        this._paramsEco = params
    }

    refreshToken = async() => {
        let resultCall:any = await this.getTokenServer()

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

    getProdutos = async(urlEndPoint: string, filter: EcoFilterService): Promise<RequestPromise<[]>> => {
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

        return this.get('', {baseUrl: urlEndPoint,   qs: filter, useQuerystring: true})
    }

    private verbalizeFunc = (method: string) => {
        return async(uri: string, filter?: RequestPromiseOptions) => {
            if (!this.tokenIsValid()) {
                await this.refreshToken()
            }

            let params = request.initParams(uri, filter)
            params.method = method.toUpperCase()
            params.auth = { bearer: this._tokenServer }
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




function initParamsBody(params: EcoParams): EcoParamsBody {
    const dateStr = dateFormat.asString('yyyy-MM-dd hh:mm:ss', new Date())
    // const dateStr = '2020-x04-02 17:33:11'
    let hashPreValidate = ''
    let hashValidadeCode = ''
    let hashUsuarioSenha = ''
    let hashSenhaValidate = ''

    hashPreValidate = crypto.createHash('sha1').update(params.idLocal + params.codigoValidacaoLocal).digest('base64')
    hashValidadeCode = crypto.createHash('sha1').update(dateStr + hashPreValidate).digest('base64')
    hashUsuarioSenha = crypto.createHash('sha1').update(params.usuarioEco + params.senhaEco).digest('hex')
    hashSenhaValidate = crypto.createHash('sha1').update(params.dbId + params.empresaEco + params.usuarioEco + hashUsuarioSenha + dateStr)
        .digest('base64')

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
    }
}


