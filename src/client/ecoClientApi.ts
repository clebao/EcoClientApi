import { EcoParams } from './eco-params'
import { EcoParamsBody } from './eco-params-body'
import * as crypto from 'crypto'
import * as request from 'request-promise'
// @ts-ignore
import * as dateFormat from 'date-format'


export class EcoClientApi{

    private readonly _paramsBody: EcoParamsBody
    private _paramsEco: EcoParams

    constructor(params: EcoParams) {
        this._paramsBody = initParamsBody(params)
        this._paramsEco = params
    }

    getTokenServer = async(): Promise<string> => {
        const reqApi = await request.post(this._paramsEco.url, {
            oauth: {
                consumer_key: this._paramsEco.consumerKey,
                consumer_secret: this._paramsEco.consumerSecret,
                token: this._paramsEco.accessToken,
                token_secret: this._paramsEco.tokenSecret
            },
            form: this._paramsBody
        })

        if (reqApi.response.statusCode == 200) {
            return reqApi.response?.body.id
        } else {
            return ''
        }
    }
}


function initParamsBody(params: EcoParams): EcoParamsBody {
    const dateStr = dateFormat.asString('yyyy-MM-dd hh:mm:ss', new Date())
    let hashPreValidate = ''
    let hashValidadeCode = ''
    let hashUsuarioSenha = ''
    let hashSenhaValidate = ''

    hashPreValidate=  crypto.createHash('sha1').update(params.idLocal + params.codigoValidacaoLocal).digest('base64')
    hashValidadeCode = crypto.createHash('sha1').update(dateStr + hashPreValidate).digest('base64')
    hashUsuarioSenha = crypto.createHash('sha1').update(params.usuarioEco + params.senhaEco).digest('hex')
    hashSenhaValidate = crypto.createHash('sha1').update(params.dbId + params.empresaEco + params.usuarioEco + hashUsuarioSenha + dateStr)
        .digest('base64')

    return {
        dbid: params.dbId,
        timesamp: dateStr,
        localid: params.codigoValidacaoLocal,
        localcode: hashValidadeCode,
        empresa: params.empresaEco,
        usuario: params.usuarioEco,
        senha: hashSenhaValidate
    }
}


