/**
 * @author hgd
 * @date 2020/11/20
 */
import AbsApi from '../abs-api'
import {Handler} from '../../@types/custom-type'
import fileScan from '../../util/file-scan'
import * as path from "path";

export default class ListFiles extends AbsApi {

  /**
   * 获取所有文件
   */
  api(): [string, string] {
    return ['get', '/files']
  }

  handler(): Handler {
    return async (ctx, next) => {
      const deep = Number.parseInt(ctx.query.deep) || 0
      const exclude = ('node_modules,' + (ctx.query.exclude || '')).split(',')
      const files = await fileScan([ctx.gitLocation], [], exclude, deep)
      const relativePaths = files.map(f => f.replace(ctx.gitLocation + path.sep, ''))
      ctx.response.status = 200
      ctx.response.body = relativePaths
    }
  }

}
