<template>
  <div class="watermask">
    <div class="title">水印设置</div>
    <div class="contain">
      <div class="left">
        <el-form :model="form" label-width="120px">
          <el-form-item label="水印格式">
            <el-input class="mb-20" v-model="form.type" />
            <div class="box mb-20">
              <el-input v-model="form.product" />
              <span class="colon">:</span>
              <el-input v-model="form.port" />
            </div>
            <el-date-picker
              style="width: 100%"
              v-model="form.date"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择时间"
            />
          </el-form-item>
          <el-form-item label="文字颜色">
            <el-color-picker v-model="form.color" color-format="rgb" />
          </el-form-item>
          <el-form-item label="文字大小">
            <div class="box">
              <el-slider v-model="form.fontSize" show-input :min="0" :max="100" />
            </div>
          </el-form-item>
          <el-form-item label="倾斜角度">
            <div class="box">
              <el-slider v-model="form.rotate" show-input :min="0" :max="360" />
            </div>
          </el-form-item>
          <el-form-item label="水印透明度">
            <el-slider v-model="form.opacity" show-input :min="0" :max="100" />
          </el-form-item>
          <el-form-item label="水印密度">
            <el-slider v-model="form.density" show-input :min="0" :max="300" />
          </el-form-item>
          <el-form-item>
            <el-button @click="save"> 保存 </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="right">
        <div class="box" ref="canvasParentRef">
          <canvas id="canvas"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import html2canvas from 'html2canvas'

/* ts类型定义区域 */
interface IForm {
  type: string
  product: string
  port: number
  date: string
  color: string // 文字颜色
  fontSize: number // 文字大小
  rotate: number // 倾斜角度
  opacity: number // 水印透明度
  density: number // 水印密度
}

/* 定义数据区域 */
const form = ref<IForm>({
  type: '机密数据',
  product: '天安信安全魔盒',
  port: 138888,
  date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  color: 'rgb(229, 234, 242)',
  fontSize: 16,
  rotate: 30,
  opacity: 100,
  density: 100
})
const canvasParentRef = ref()

/* 事件处理区域 */
const setCanvasData = () => {
  const rate = 1.5 // 字体间距缩放比例

  const canvas: HTMLCanvasElement = document.querySelector('#canvas')!
  const canvasParent = canvasParentRef.value

  // 画布大小需要为容器的对角线长度,
  // 画布在旋转时不会出现对角空白无水印！！！
  const maxSizeContainer = Math.max(canvasParent.offsetWidth, canvasParent.offsetHeight)
  const minSizeCanvas = Math.ceil(Math.SQRT2 * maxSizeContainer)

  // 设置画面的最小尺寸
  canvas.setAttribute('width', String(minSizeCanvas))
  canvas.setAttribute('height', String(minSizeCanvas))

  // 修改画布在容器中的偏移，使其中心位置与容器的中心位置永远保持一致
  // 在旋转角度时也要以其中心点为中心进行旋转
  canvas.style.top = -Math.ceil((minSizeCanvas - maxSizeContainer) / 2) + 'px'
  canvas.style.left = -Math.ceil((minSizeCanvas - maxSizeContainer) / 2) + 'px'

  // 画笔
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!

  // 设置文字样式
  ctx.font = `${form.value.fontSize}px 微软雅黑`
  // 透明度
  const prefix = form.value.color.split(')')[0]
  ctx.fillStyle = `${prefix},${form.value.opacity / 100})`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'

  const text1 = form.value.type
  const text2 = `${form.value.product} ：${form.value.port}`
  const text3 = form.value.date
  const text1Length = ctx.measureText(text1).width
  const text2Length = ctx.measureText(text2).width
  const text3Length = ctx.measureText(text3).width
  const maxLenghtText = Math.max(text1Length, text2Length, text3Length)

  // 计算字符串的横向与纵向间距，设置了font的大小与字体
  const offsetX = Math.ceil(maxLenghtText) + form.value.density
  const offsetY = form.value.fontSize * rate * 3 + form.value.density

  // 列/行数
  const rowCount = Math.ceil(minSizeCanvas / offsetY)
  const colCount = Math.ceil(minSizeCanvas / offsetX)

  // 移动旋转
  ctx.translate(minSizeCanvas / 2, minSizeCanvas / 2)
  ctx.rotate((form.value.rotate * Math.PI) / 180)
  ctx.translate(-minSizeCanvas / 2, -minSizeCanvas / 2)

  // 行
  for (let i = 0; i < rowCount; i++) {
    // 列
    for (let j = 0; j < colCount; j++) {
      ctx.fillText(
        text1,
        offsetX * j + (maxLenghtText - text1Length) / 2,
        offsetY * i - form.value.fontSize * rate
      )
      ctx.fillText(text2, offsetX * j + (maxLenghtText - text2Length) / 2, offsetY * i)
      ctx.fillText(
        text3,
        offsetX * j + (maxLenghtText - text3Length) / 2,
        offsetY * i + form.value.fontSize * rate
      )
    }
  }
}

// 保存
const save = () => {
  html2canvas(canvasParentRef.value, {
    scale: window.devicePixelRatio, //设备像素比
    backgroundColor: null, //设置截图的背景色
    allowTaint: false, //允许跨域（图片跨域相关）
    useCORS: true, // 如果截图的内容里有图片,可能会有跨域的情况,加上这个参数,解决文件跨域问题
    taintTest: true //是否在渲染前测试图片
  }).then((canvas: any) => {
    // 导出图像
    const url = canvas.toDataURL('image/png', 1.0)
    const saveLink = document.createElement('a') // 创建a链接
    saveLink.href = url
    saveLink.download = '水印.png' // 下载的图片名称
    saveLink.click()
  })
}
/* 监听 */
watch(form.value, (newVal) => {
  console.log('newVal', newVal)
  setCanvasData()
})

/* 生命周期 */
onMounted(() => {
  setCanvasData()
})
</script>

<style lang="less" scoped>
.watermask {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .title {
    font-size: 16px;
    font-weight: 600;
    padding: 10px;
    padding-bottom: 50px;
    background-color: #f7f9fe;
  }
  .mb-20 {
    margin-bottom: 20px;
  }
  .contain {
    width: 100%;
    display: flex;
    flex: 1;
  }

  .left {
    width: 50%;
    background-color: #f7f9fe;
    padding-right: 100px;

    .box {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .colon {
        margin: 0 20px;
      }
      .units {
        margin-left: 20px;
      }
    }
  }
  .right {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f7f9fe;
    padding: 0 20px 20px 20px;

    .box {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background-color: #fff;
      position: relative;
      #canvas {
        position: absolute;
      }
    }
  }
}
</style>
