# git-proxy 【_Beta_】

代理某个 git repository 目录，使其可以通过http的方式来远程操作

## API
注：下面提到的文件路径均是相对于项目根目录的路径。
- GET `/files`
    - 功能：查看目录下所有文件
    - 参数：
        - `deep? = 1` 搜索深度
        - `exclude = node_modules` 排除的路径，如 '/dist'，多个路径以 `,` 分隔
    - 返回值：`Array<String>` 文件路径数组
- POST `/file/fetch`
    - 功能：拉取特定文件
    - 参数：`filePath` 文件路径
    - 返回值：文件内容
- POST `/file/commit`
    - 功能：提交
    - 参数：
        - `filePath` 文件路径
        - `file` 文件内容
        - `author` 修改人
        - `message` 提交信息
        - `push = true` commit后是否执行push操作
    - 返回值：commit/push 的结果，json格式
        
## 使用方式
- 部署要求：
    - 已安装 node 和 git
    - git项目已初始化并且配置好用户及remote
    
- 使用
    - 直接将 `release/git-proxy.js` 文件放在git项目目录(或其他子目录)下，`node git-proxy.js` 启动。
    - 更改端口：`PORT=3333 node git-proxy.js`
    - CORS设置
      ```sh
      # 不配置的话，会返回请求头中的origin
      ORIGINS=http://localhost:9527,http://localhost:9528 node git-proxy.js
      ```
    - 后台运行（或pm2等其他方式）：
      ```sh
      # 脚本放在 .git/ 目录下
      nohup node .git/git-proxy.js >> abc.log 2>&1 &
      ```
    

