import * as Router from 'koa-router'
import {SimpleGit} from 'simple-git'

/**
 * @author hgd
 * @date 2020/11/20
 */

export interface ICustomAppContext {
  gitLocation: string;
  git: SimpleGit
}

export interface ICustomAppState {
  abc: string;
}

export type Handler = Router.IMiddleware<ICustomAppState, ICustomAppContext>
