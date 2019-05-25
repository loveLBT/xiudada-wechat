import { observable, action } from 'mobx'

class CodeBtnStore {
	@observable time = 60
	@observable txt = '获取验证码'
	@observable disabled = false

	@action countDown = () => {
		if(this.time === 0){
			this.time = 60
			this.txt = '获取验证码'
			this.disabled = false
			clearInterval(this.timer)
		}else{
			this.time = this.time -1
			this.txt = this.time + 's'
			this.disabled = true
			this.timer = setTimeout(() => {
			  this.countDown()
			}, 1000)
		}
	}
}

export default CodeBtnStore