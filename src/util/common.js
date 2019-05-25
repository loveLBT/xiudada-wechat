import Taro from '@tarojs/taro'
/*获取当前页url*/
export const getCurrentPageUrl = () => {
  let pages = getCurrentPages()
  let currentPage = pages[pages.length - 1]
  let url = currentPage.route
  return url
}
export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
export const formatTime = (date,format) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  if(format === 'YYYY-MM-DD HH:mm') {
  	return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
  }else if(format === 'HH:mm') {
  	return [hour, minute].map(formatNumber).join(':')
  }else if(format === 'YYYY-MM-DD'){
  	return [year, month, day].map(formatNumber).join('-')
  }else {
  	return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  } 
  
}
/**
 * [description]
 * @param {string} name 错误名字
 * @param {string} action 错误动作描述
 * @param {string} info 错误信息，通常是 fail 返回的
 */

export const logError = (name, action, info) => {
	if(!info){
		info = 'empty'
	}
	try {
		let deviceInfo = Taro.getSystemInfoSync()
		var device = JSON.stringify(deviceInfo)
	} catch(err) {
		console.error('not support getSystemInfoSync api', e.message)
	}

	let time = formatTime(new Date())
	console.error(time, name, action, info, device)

	if (typeof info === 'object') {
	  info = JSON.stringify(info)
	}
	Taro.showToast({
		title: action,
		icon: 'none'
	})
}

export const logMessage = (msg) => {
	Taro.showToast({
		title: msg,
		icon: 'none'
	})
}