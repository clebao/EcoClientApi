import { EcoB2BParams } from './eco-b2b-params'
import request, { RequestPromise } from 'request-promise'


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

    /**
     * Envia os Produtos carregados do Servidor de API do Sistema eco e envia para o
     * Servidor de API do B2B.
     *
     * @param uri Endereço do endpoint da syncronização de clientes.
     * @param produtos Registros de Produtos carregados do Servidor de Api do Sistema ECO.
     */
    sendProdutos = async(uri: string, produtos: any[]): Promise<RequestPromise> => {
        let options = {
            method: 'POST',
            uri,
            json: true,
            body: produtos,
            resolveWithFullResponse: true
        }

        return this.serverRequest(options)
    }

    /**
     * Envia os Clientes carregados do Servidor de API do Sistema eco e envia para o
     * Servidor de API do B2B.
     *
     * @param uri Endereço do endpoint da syncronização de clientes.
     * @param clientes Registros de Clientes carregados do Servidor de Api do Sistema ECO.
     */
    sendClientes = async(uri: string, clientes: any[]): Promise<RequestPromise> => {
        let options = {
            method: 'POST',
            uri,
            json: true,
            body: clientes,
            resolveWithFullResponse: true
        }

        return this.serverRequest(options)
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
