/**
 * 根据list获取到叶子节点
 */
export function getLeafFromList(list) {
  const pidSet = new Set()
  list.forEach(item => pidSet.add(item.pid))
  return list.filter(item => !pidSet.has(item.id))
}

/**
 * list 转 tree
 */
export function listToTree(data) {
  const idSet = new Set()
  const pidSet = new Set()
  const map = new Map()
  data.forEach(item => {
    idSet.add(item.id)
    pidSet.add(item.pid)
    map.get(item.pid) ? map.get(item.pid).push(item) : map.set(item.pid, [item])
  })
  return data.filter(item => {
    if (map.get(item.id)) item.children = map.get(item.id)
    return (!idSet.has(item.pid)) && pidSet.has(item.pid)
  })
}

/**
 * tree 转 list
 */
export function treeToList(tree) {
  const result = []
  recursive(tree)
  return result
  function recursive(data) {
    data.forEach(item => {
      result.push(item)
      if (item.children && item.children.length > 0) {
        recursive(item.children)
      }
    })
  }
}
