export const regNull = (val, tip) => {
	return new Promise((resolve, reject) => {
		if(!val) {
			reject(tip)
		}else {
			resolve(true)
		}
	})
}

export const regPhone = (phone) => {
	return new Promise((resolve,reject) => {
		const reg = /^1[34578]\d{9}$/
		if (!phone) {
			reject('请输入手机号')
		}else {
			if(!reg.test(phone)){
				reject('手机号格式不正确')
			}else {
				resolve(true)
			}
		}
	})
}