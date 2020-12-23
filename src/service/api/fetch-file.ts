import AbsApi from '../abs-api'
import {Handler} from '../../@types/custom-type'
import fs from 'fs'
import path from "path";

/**
 * @author hgd
 * @date 2020/11/22
 */
export default class FetchFile extends AbsApi {

  /**
   * 获取所有文件
   */
  api(): [string, string] {
    return ['post', '/file/fetch']
  }

  handler(): Handler {
    return async (ctx, next) => {
      const status = await ctx.git.status();
      // 暂定为仅以下情况才拉取，否则不好解决冲突
      if (status.conflicted.length === 0 && status.modified.length === 0 && status.ahead === 0 && status.behind > 0) {
        await ctx.git.pull()
      }
      const buffer = fs.readFileSync(path.resolve(ctx.gitLocation, ctx.request.body.filePath))
      ctx.response.status = 200
      ctx.response.body = buffer.toString()
    }
  }

}
