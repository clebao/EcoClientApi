import { EcoClientApi } from './client/ecoClientApi'

export default function Test() {

    const client = new EcoClientApi({
        consumerKey: 'U0fnH3d5254yrgRnT5MFSKYA9Ta3Mg6fMLSR4A',
        consumerSecret: 'sKJYL0zhT6wxEDdkFLbfToe5NyTzqpqtrO4vBA',
        accessToken: 'DFrHtV6nN_5ymRJ4WWmBSb4qCYvh7OL_vaDg7A',
        tokenSecret: 'DrEq3coX_juGfYS-3D6uQKp75K91XCs6WGWccA',
        url: 'https://sistema.eco.br/api/v0',
        idLocal: 'H84175318221319',
        codigoValidacaoLocal: 'servidor38',
        dbId: 'db1',
        usuarioEco: 'SUPERVISOR',
        empresaEco: '01',
        senhaEco: 'ECOCB1',
        loginUsuarioEco: true
    })

    client.getTokenServer()
        .then(result => {
            console.log(result)
        })
}
