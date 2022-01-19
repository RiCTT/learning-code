const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const generate = require('@babel/generator').default
const template = require('@babel/template').default
const types = require('@babel/types')
const fs = require('fs')
const path = require('path')

const sourceCode = `
  console.log(1);

  function func() {
    console.info(2);
  }

  export default class Clazz {
    say() {
      console.debug(3);
    }
    render() {
      return <div>{console.error(4)}</div>
    }
  }
`

const ast = parser.parse(sourceCode, {
  // 自行判断是否esm模块
  sourceType: 'unambiguous',
  plugins: ['jsx']
})

const targetCalleeName = ['log', 'info', 'error', 'debug'].map(item => {
  return `console.${item}`
})
traverse(ast, {
  CallExpression (path, state) {
    // 判断的方式来插入
    // if (
    //   // 如果是某个实例的方法
    //   types.isMemberExpression(path.node.callee)
    //   && path.node.callee.object.name === 'console'
    //   && ['log', 'info', 'error', 'debug'].includes(path.node.callee.property.name)
    // ) {
    //   const { line, column } = path.node.loc.start
    //   path.node.arguments.unshift(types.stringLiteral(`filename: (${line} ${column})`))
    // }
    
    // 利用模板生成进行比对
    // const calleeName = generate(path.node.callee).code
    // if (targetCalleeName.includes(calleeName)) {
    //   const { line, column } = path.node.loc.start
    //   path.node.arguments.unshift(types.stringLiteral(`filename: (${line} ${column})`))
    // }

    // 改变需求，在打印的节点之前打印
    // 要考虑多种场景，比如在jsx中调用，那就不能纯粹的前一行插入了
    // 插入可以使用path.insertBefore
    // 替换节点则path.replaceWith
    if (path.node.isNew) {
      return
    }

    const calleeName = generate(path.node.callee).code
    if (targetCalleeName.includes(calleeName)) {
      const { line, column } = path.node.loc.start
      const newNode = template.expression(`console.log("fileName: (${line}, ${column})")`)()
      newNode.isNew = true

      if (path.findParent(path => path.isJSXElement())) {
        path.replaceWith(types.arrayExpression([newNode, path.node]))
        // 跳过子节点处理
        path.skip()
      } else {
        path.insertBefore(newNode)
      }
    }

  }
})

const { code, map } = generate(ast)
console.log(code)

const targetPath = path.join(__dirname, './result.js')
fs.writeFileSync(targetPath, code, 'utf-8')
