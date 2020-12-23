/**
 * @author hgd
 * @date 2020/11/20
 */
import Koa from 'koa'
import routes from './routes'
import fs from 'fs'
import path from 'path'
import {ICustomAppContext, ICustomAppState} from './@types/custom-type'
import simpleGit, {SimpleGit} from 'simple-git'
import koaBody from 'koa-body'
import cors from '@koa/cors'
import log from 'fancy-log'

const port = process.env.PORT || 3210
const allowOrigins = process.env.ORIGINS && process.env.ORIGINS.split(',')
const app = new Koa<ICustomAppState, ICustomAppContext>()
app.use(koaBody())
app.use(cors({
  origin: (ctx) => {
    const ori = ctx.request.header.origin
    if (allowOrigins && !allowOrigins.includes(ori)) {
      return null;
    } else {
      return ori
    }
  }
}))
app.use(routes)

const gitPath = gitLocation()
if (gitPath) {
  const git: SimpleGit = simpleGit({
    baseDir: gitPath,
    binary: 'git',
  })
  app.context.gitLocation = gitPath
  app.context.git = git
  app.listen(port, () => {
    log(`PID: ${process.pid}, 监听 ${port} 端口，当前监听的Git项目目录是：${gitPath}`)
  })
} else {
  log.warn('未找到Git项目目录')
}

function gitLocation() {
  let indexLocation
  // pkg打包后的情况
  if (__dirname.startsWith('/snapshot')) {
    indexLocation = process.cwd()
  } else {
    indexLocation = __dirname
  }
  let gitLocation = ''
  for (let i = 0; i < 3; i++) {
    const dir = path.resolve(indexLocation, ('..' + path.sep).repeat(i))
    if (fs.existsSync(path.resolve(dir, '.git'))) {
      gitLocation = dir
      break
    }
  }
  return gitLocation
}

