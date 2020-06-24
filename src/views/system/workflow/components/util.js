import html2canvas from 'html2canvas'

export async function getScreenshot() {
  const imgHeight = window.document.querySelector('.el-form').offsetHeight
  const imgWidth = window.document.querySelector('.el-form').offsetWidth
  const scale = window.devicePixelRatio
  const imgData = await html2canvas(window.document.querySelector('.el-form'), {
    useCORS: true,
    type: 'dataURL',
    backgroundColor: null,
    scale: scale,
    width: imgWidth,
    height: imgHeight
  })
  return imgData.toDataURL()
}

/**
 * 是否修改过
 */
export function isEdited(oldVal, newVal) {
  // 首次需要保存图片
  if (!oldVal || JSON.stringify(oldVal) === '{}') return true
  for (const key in oldVal) {
    if (newVal[key] !== oldVal[key]) return true
  }
  return false
}
