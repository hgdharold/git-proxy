/**
 * @author hgd
 * @date 2020/11/20
 */
import {Handler} from '../@types/custom-type'

export default abstract class AbsApi {

  /**
   * @return 路由对应的 http method 和 url
   */
  abstract api(): [string, string];

  /**
   * @return 逻辑处理中间件
   */
  abstract handler(): Handler;
}
