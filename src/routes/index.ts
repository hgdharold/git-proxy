import Router from 'koa-router'
import AbsApi from '../service/abs-api'
import * as services from '../service'
import {ICustomAppContext, ICustomAppState} from '../@types/custom-type'

/**
 * @author hgd
 * @date 2020/11/20
 */
class MyRouter {

  private routeConfig: Array<AbsApi> = []

  constructor() {
    Object.values(services).forEach(v => {
      this.routeConfig.push(new v())
    })
  }

  routes() {
    const router = new Router<ICustomAppState, ICustomAppContext>()
    this.routeConfig.forEach(rt => {
      const [method, url, handler] = [...rt.api(), rt.handler()]
      // console.log(`add route: [ ${method} ] [ ${url} ] [ ${rt.constructor.name} ]`)
      // @ts-ignore
      router[method](url, handler)
    })
    return router.routes()
  }
}

export default new MyRouter().routes()
