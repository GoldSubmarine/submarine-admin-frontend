import html2canvas from 'html2canvas'

export async function getScreenshot(oldVal, newVal) {
  if (!isEdited(oldVal, newVal)) {
    return null
  }
  const dom = window.document.querySelector('.js-screenshot')
  const imgData = await html2canvas(dom, {
    useCORS: true,
    type: 'dataURL',
    backgroundColor: null,
    scale: window.devicePixelRatio,
    width: dom.offsetWidth,
    height: dom.offsetHeight
  })
  return imgData.toDataURL()
}

/**
 * 是否修改过
 */
function isEdited(oldVal, newVal) {
  // 首次需要保存图片
  if (!oldVal || JSON.stringify(oldVal) === '{}') return true
  for (const key in oldVal) {
    if (newVal[key] !== oldVal[key]) return true
  }
  return false
}
