import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtButton  } from 'taro-ui'

import PWDLogin from './pwdLogin'
import CodeLogin from './codeLogin'
import api from '../../service/api'
import './index.scss'

const logoIcon = require('../../assets/images/logo_icon.png')
const tabList = [
	{ title: '密码登入' },
	{ title: '验证码登入' }
]

class Login extends Component {
	config = {
    navigationBarTitleText: '登入'
  }
	constructor(props) {
	  super(props)
	
	  this.state = {
	  	current: 0,
	  	data: {}
	  }
	}
	componentDidMount () {
		this.getData()
	}
	getData () {
		Taro.showLoading({
			title: 'Loading...'
		})
		api.get(`/enterprise/mobile/info/${Taro.getStorageSync('COMPANY_ID')}`)
			.then((res) => {
				if(res.code === 200){
					Taro.hideLoading()
					Taro.setStorageSync('COMPANY_INFO', JSON.stringify(res.data))
					this.setState({
						data: res.data
					})
				}
			})
	}
	handleClick (value) {
		this.setState({
			current: value
		})
	}
	handleSubmit () {
		const { current } = this.state
		let form = null
		if(current === 0) {
			form = this.pwdLogin
		}else if(current === 1) {
			form = this.codeLogin
		}

		if(form) {
			Taro.showLoading({
				title: 'Loading...'
			})
			form.onSubmit()
				.then((res) => {
					if(res.code === 200) {
						Taro.setStorage({
							key: 'TOKEN',
							data: res.data.token,
							success () {
								api.get(`/getUser/${res.data.token}`)
									.then((res) => {
										if(res.code === 200) {
											Taro.hideLoading()
											Taro.setStorageSync('USER_INFO', JSON.stringify(res.data))
											Taro.setStorageSync('USER_ID',res.data.id)
											Taro.switchTab({
												url: '/pages/index/index',
											})
										}
									})
							}
						})
					}
				})
		}
	}
	handleNoAccount () {
		Taro.navigateTo({
	      url: '/pages/register/index'
	    })
	}
	render() {
		const { current, data } = this.state

		return (
			<View className='page'>
				<View className='header'>
					<Image className='img' src={data.logo} />
					<Text className='txt'>{data.name}</Text>
					<Text className='txt'>欢迎您</Text>
				</View>
				<View className='tab'>
					<AtTabs current={current} tabList={tabList} onClick={this.handleClick.bind(this)}>
				    <AtTabsPane current={current} index={0} >
				      <PWDLogin ref={ref=>this.pwdLogin=ref} />
		        </AtTabsPane>
		        <AtTabsPane current={current} index={1}>
		          <CodeLogin ref={ref=>this.codeLogin=ref} />
		        </AtTabsPane>
		      </AtTabs>
				</View>
				<AtButton onClick={this.handleSubmit.bind(this)} className='submit' type='primary'>登录</AtButton>
				<Text onClick={this.handleNoAccount.bind(this)} className='tip'>还没有账号，立即注册</Text>
			</View>
		)
	}
}

export default Login