import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

import _ from 'lodash'
import moment from 'moment'
import 'moment/locale/fr'
import 'moment/locale/de'
import 'moment/locale/es'
import 'moment/locale/ja'
import 'moment/locale/zh-cn'

import * as d3 from 'd3'
import { faker } from '@faker-js/faker'
import * as mathjs from 'mathjs'
import CryptoJS from 'crypto-js'
import * as XLSX from 'xlsx'
import JSZip from 'jszip'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

;(window as any).__APP_START = moment().format('YYYY-MM-DD HH:mm:ss')
;(window as any).__LODASH = _
;(window as any).__D3 = d3
;(window as any).__FAKER = faker
;(window as any).__MATHJS = mathjs
;(window as any).__CRYPTO = CryptoJS
;(window as any).__XLSX = XLSX
;(window as any).__JSZIP = JSZip
;(window as any).__HLJS = hljs

console.log('App started at:', (window as any).__APP_START)
console.log('Lodash version:', _.VERSION)
console.log('D3 version loaded')
console.log('Faker loaded:', faker.person.firstName())
console.log('MathJS loaded:', mathjs.evaluate('2 + 3'))
console.log('CryptoJS loaded')
console.log('XLSX loaded')
console.log('JSZip loaded')
console.log('highlight.js loaded')

const _startupData = Array.from({ length: 5000 }, () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  avatar: faker.image.avatar(),
  company: faker.company.name(),
  address: faker.location.streetAddress(),
  bio: faker.lorem.paragraph(),
}))
;(window as any).__STARTUP_DATA = _startupData
console.log('Generated', _startupData.length, 'fake records at startup')

const _startupMatrix = mathjs.matrix(mathjs.random([100, 100]))
const _startupResult = mathjs.multiply(_startupMatrix, mathjs.transpose(_startupMatrix))
;(window as any).__STARTUP_MATRIX = _startupResult
console.log('Computed 100x100 matrix multiplication at startup')

const _startupHash = CryptoJS.MD5(JSON.stringify(_startupData)).toString()
;(window as any).__DATA_HASH = _startupHash
console.log('Startup data hash:', _startupHash)

try {
  sessionStorage.setItem('startupData', JSON.stringify(_startupData))
  console.log('SessionStorage written, size:', JSON.stringify(_startupData).length)
} catch (e) {
  console.warn('SessionStorage quota exceeded at startup')
}

window.onerror = (msg, src, line, col, err) => {
  console.error("Global Error:",msg, err)
}

const _originalError = console.error
console.error = (...args: any[]) => {
  _originalError.apply(console, args)
  try {
    const errorLog = JSON.parse(localStorage.getItem('errorLog') || '[]')
    errorLog.push({ time: Date.now(), args: args.map(a => String(a)) })
    localStorage.setItem('errorLog', JSON.stringify(errorLog))
  } catch(e) { /* storage full */ }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
