import { EcoB2BParams } from './eco-b2b-params'
import request from 'request-promise'


export class EcoB2BClient {

    private _paramsB2B: EcoB2BParams

    constructor(params: EcoB2BParams) {
        this._paramsB2B = params
    }

    private verbalizeFunc = (method: string) => {
        return (uri: string, options?: request.RequestPromiseOptions, body?: any): request.RequestPromise => {
            let params = request.initParams(uri, options)
            params.method = method.toUpperCase()
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

    initParams = request.initParams
    serverRequest = request
}
