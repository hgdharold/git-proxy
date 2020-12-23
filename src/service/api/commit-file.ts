/**
 * @author hgd
 * @date 2020/11/24
 */
import AbsApi from '../abs-api'
import {Handler} from '../../@types/custom-type'
import fs from 'fs'
import {CommitSummary, PushResult} from 'simple-git'
import path from "path";

export default class CommitFile extends AbsApi {
  api(): [string, string] {
    return ['post', '/file/commit']
  }

  handler(): Handler {
    return async (ctx, next) => {
      // TODO api参数检查
      const filePath = path.resolve(ctx.gitLocation, ctx.request.body.filePath)
      const file = ctx.request.body.file
      const author = ctx.request.body.author
      const message = ctx.request.body.message
      if (!author || !message) {
        ctx.response.status = 400
        ctx.response.body = {message: 'lack of author or commit message'}
        return
      }
      const push = ctx.request.body.push === 'false' ? false : !!ctx.request.body.push
      fs.writeFileSync(filePath, file)
      await ctx.git.add(filePath)
      let result: CommitSummary | PushResult
      result = await ctx.git.commit(`[by ${author}] ` + message)
      if (push) {
        result = await ctx.git.push()
      }
      ctx.response.status = 200
      ctx.response.body = result
    }
  }

}
