import Taro from '@tarojs/taro'
import { HTTP_STATUS } from '../constants/status'
import { baseUrl } from './config'
import { logError } from '../util/common'
import { requestError1, requestError2 } from '../util'
 
export default {
	baseOptions(params, method = 'GET') {
		let { url, data, contentType = 'application/json' } = params
		const options = {
			url: url.indexOf('http') !== -1 ? url : baseUrl + url,
			data: data,
			method: method,
			header: {
				'content-type': contentType,
				'Cookie': Taro.getStorageSync('SESSION_ID'),
				'XDD_TOKEN': Taro.getStorageSync('TOKEN')
			}
		}
		return new Promise((resolve, reject) => {
			Taro.request(options)
				.then((res) => {
					if(res.statusCode !== HTTP_STATUS.SUCCESS){
						requestError1(res.statusCode)
					}else{
						if(res.data.code !== HTTP_STATUS.SUCCESS){
							requestError2(res.data.code, res.data.msg)
						}
						resolve(res.data)
					}
				})
				.catch((err) => {
					logError('api', '请求接口出现问题', err)
				})
		})
	},
	get(url, data = '') {
		let options = {url, data}
		return this.baseOptions(options)
	},
	post(url, data, contentType) {
		let options = {url, data, contentType}
		return this.baseOptions(options, 'POST')
	},
	put(url, data = '') {
		let options = {url, data} 
		return this.baseOptions(options, 'PUT')
	},
	delete(url, data = '') {
		let options = {url, data}
		return this.baseOptions(options, 'DELETE')
	}
}