/**
 * @author hgd
 * @date 2020/11/22
 */
import fs from 'fs'
import path from 'path'

export default async function scan(
  dirs: string[],
  include: Array<string | RegExp>,
  exclude: Array<string | RegExp>,
  deep = 0,
  includeHiddenFile = false,
): Promise<string[]> {
  // TODO 校验参数
  deep = deep < 0 ? 0 : deep
  // TODO 提供重载函数
  // TODO 支持gitignore
  const result: string[] = []
  const _include = replaceSlash(include)
  const _exclude = replaceSlash(exclude)
  for (let dir of dirs) {
    dir = path.resolve(dir)
    result.push(...await scanDir(dir, _include, _exclude, path.resolve(dir), deep))
  }
  return result
}

async function scanDir(dir: string, include: Array<string | RegExp>, exclude: Array<string | RegExp>,
                       baseDir: string, deepLimit = 0, includeHidden = false): Promise<string[]> {
  const result: string[] = []
  const files = await fs.readdirSync(dir, {withFileTypes: true})
  for (const file of files) {
    const name = file.name
    if (name.startsWith('.') && !includeHidden) continue
    const filePath = path.resolve(dir, name)
    const fileRelativePath = filePath.replace(baseDir, '')
    const fileDeep = fileRelativePath.split(path.sep).length
    if (ifInclude(fileRelativePath, include, exclude)) {
      if (file.isFile()) {
        result.push(filePath)
      } else {
        if (deepLimit === 0 || fileDeep <= deepLimit) {
          result.push(...await scanDir(filePath, include, exclude, baseDir, deepLimit))
        }
      }
    }
  }
  return result
}

function ifInclude(pth: string, include: Array<string | RegExp>, exclude: Array<string | RegExp>) {
  let isInclude = true
  if (include && include.length > 0) {
    isInclude = false
    for (const strOrReg of include) {
      if (strOrReg && matchPath(pth, strOrReg)) {
        isInclude = true
        break
      }
    }
  }
  if (isInclude) {
    if (exclude && exclude.length > 0) {
      for (const strOrReg of exclude) {
        if (strOrReg && matchPath(pth, strOrReg)) {
          isInclude = false
          break
        }
      }
    }
  }
  return isInclude
}

function replaceSlash(pth: Array<string | RegExp>): Array<string | RegExp> {
  return pth.map(p => {
    if (typeof p === 'string') {
      return p.replace(/\\/g, path.sep)
    }
    return p
  })
}

function matchPath(pth: string, pattern: string | RegExp): boolean {
  if (typeof pattern === 'string') {
    return pth.includes(pattern)
  } else {
    return !!pth.match(pattern)
  }
}

//
// scan([path.resolve(__dirname, "../../")], [], ['node_modules'], 3).then(res => {
//   console.log(res);
// })
