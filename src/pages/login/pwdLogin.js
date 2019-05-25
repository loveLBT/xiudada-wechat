import Taro, { Component } from '@tarojs/taro'
import { View  } from '@tarojs/components'

import InputItem from '../../components/InputItem'
import api from '../../service/api'
import { regPhone, regNull } from '../../util/reg'
import * as images from '../../util/requireImages'


class PWDLogin extends Component {
	static options = {
		addGlobalClass: true
	}

	constructor(props) {
	  super(props)
	
	  this.state = {
	  	username: '',
	  	password: ''
	  }
	}
	handleChange (key, e) {
		this.setState({
			[key]:e.detail.value
		})
	}
	onSubmit () {
		const { username, password } = this.state
		return new Promise((resolve) => {
			Promise.all([regPhone(username), regNull(password, '请输入密码')])
			.then((res) => {
				api.post('/loginCustomer',{ username, password, companyId: Taro.getStorageSync('COMPANY_ID') })
					.then((res) => {
						resolve(res)
					})
			})
			.catch((err) => {
				Taro.showToast({
					title: err,
					icon: 'none'
				})
			}) 
		})
		
		

	}
	render() {
		const { username, password } = this.state

		return (
			<View className='pwd-login'>
				<InputItem
			    name='username'
			    icon={images.phoneIcon}
			    type='phone'
			    placeholder='请输入账号'
			    value={username}
			    onChange={this.handleChange.bind(this,'username')}
			    border={false}
			  />
			  <InputItem
			    name='password'
			    icon={images.lockIcon}
			    type='password'
			    placeholder='请输入密码'
			    value={password}
			    onChange={this.handleChange.bind(this,'password')}
			    border={false}
			  />
			</View>
		)
	}
}

export default PWDLogin