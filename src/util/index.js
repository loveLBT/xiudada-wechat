import Taro, { Component } from '@tarojs/taro'
import { HTTP_STATUS } from '../constants/status'
import { logError, logMessage, getCurrentPageUrl } from './common'

export const requestError1 = (code) => {
	switch (code) {
		case HTTP_STATUS.NOT_FOUND:
			logError('api', '请求资源不存在')
			break
		case HTTP_STATUS.BAD_GATEWAY:
			logError('api', '服务端出现了问题')
			break
		case HTTP_STATUS.FORBIDDEN:
		 	logError('api', '没有权限访问')
		 	logout()
		 	break
		case HTTP_STATUS.CLIENT_ERROR:
			logError('api', '请求参数错误')
			break
		case HTTP_STATUS.AUTHENTICATE:
			logError('api', '需要鉴权')
			logout()
			break
	}
}
export const requestError2 = (code, msg) => {
	switch (code) {
		case HTTP_STATUS.CLIENT_ERROR:
			logMessage(msg || '请求参数错误')
			break
		case HTTP_STATUS.AUTHENTICATE:
			logMessage(msg || '请求没有权限')
			logout()
			break
		case HTTP_STATUS.SERVER_ERROR:
			logMessage(msg || '服务器出错')
			break
		default:
			logMessage(msg || '未知错误')
	}
}

export const logout = () => {
	Taro.removeStorageSync('TOKEN')
	Taro.removeStorageSync('SESSION_ID')
	Taro.removeStorageSync('USER_ID')
	let path = getCurrentPageUrl()

  if (path !== 'pages/login/index') {
    Taro.redirectTo({
      url: '/pages/login/index'
    })
  }
}