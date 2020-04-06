import * as ecoClient from './client/ecoClientApi'

export default ecoClient

// import { EcoClientApi } from './client/ecoClientApi'
// import { EcoFilterService } from './client/eco-filter-service'
//
// export async function Test() {
//
//     const client = new EcoClientApi({
//         consumerKey: 'U0fnH3d5254yrgRnT5MFSKYA9Ta3Mg6fMLSR4A',
//         consumerSecret: 'sKJYL0zhT6wxEDdkFLbfToe5NyTzqpqtrO4vBA',
//         accessToken: 'DFrHtV6nN_5ymRJ4WWmBSb4qCYvh7OL_vaDg7A',
//         tokenSecret: 'DrEq3coX_juGfYS-3D6uQKp75K91XCs6WGWccA',
//         url: 'https://sistema.eco.br/api/v0',
//         idLocal: 'H84175318221319',
//         codigoValidacaoLocal: 'servidor38',
//         dbId: 'db1',
//         usuarioEco: 'SUPERVISOR',
//         empresaEco: '01',
//         senhaEco: 'ECOCB1',
//         loginUsuarioEco: true
//     })
//
//     let qtdReg = -1
//     let filterProd: EcoFilterService = {
//         consultaCompleta: 'S',
//         qtdeRegistros: 500,
//     }
//
//     do {
//
//
//         let resultRequest = await client.getProdutos('http://sistema.eco.br/api/v0/produto', filterProd)
//
//         if (resultRequest && resultRequest.length > 0) {
//             // @ts-ignore
//             filterProd.ultimoId = resultRequest[resultRequest.length -1].codigo
//         }
//
//         qtdReg = resultRequest.length
//         console.log(resultRequest)
//
//     } while (qtdReg >= 0)
//
//
//
// }
//
//
// Test()
//     .catch(error => console.log(error))
