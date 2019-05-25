import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { observer } from '@tarojs/mobx'

import InputItem from '../../components/InputItem'
import { regPhone, regNull } from '../../util/reg'
import CodeBtnStore from '../../store/CodeBtnStore'
import * as images from '../../util/requireImages'
import { baseUrl } from '../../service/config'
import api from '../../service/api'
import './index.scss'

@observer
class Register extends Component {
	config = {
    navigationBarTitleText: '注册'
  }
	constructor(props) {
	  super(props)
	
	  this.state = {
	  	data: {},
	  	phone: '',
	  	code: '',
	  	imgCode: '',
	  	imgCodeUrl: '',
	  	password: ''
	  }
	  this.codeBtnStore = new CodeBtnStore()
	}
	componentWillMount () {
		let data = Taro.getStorageSync('COMPANY_INFO')
		this.setState({
			data: JSON.parse(data)
		})
	}
	componentDidShow () {
		this.getImgCodeUrl()
	}
	getImgCodeUrl () {
		const that = this
		Taro.request({
			url: `${baseUrl}/phoneLogin/validateCode`,
			method: 'GET',
			responseType: 'arraybuffer',
			success (res) {
				let base64 = 'data:image/jpeg;base64,' + Taro.arrayBufferToBase64(res.data)
				that.setState({
					imgCodeUrl: base64
				})
				Taro.setStorageSync('SESSION_ID', res.header['Set-Cookie'])
			}
		})
	}
	handleChange (key, e) {
		this.setState({
			[key]:e.detail.value
		})
	}
	handleGetCodeClick () {
		const { phone, imgCode } = this.state
		Promise.all([regPhone(phone), regNull(imgCode, '请输入图形验证码')])
			.then((res) => {
				Taro.showLoading({
					title: 'Loading...'
				})
				api.post('/phoneLogin/validateCode/check', {telephone: phone, verifyCode: imgCode})
					.then((res) => {
						if(res.code === 200) {
							api.get('/phoneLogin/verification', {telephone: phone, companyId: Taro.getStorageSync('COMPANY_ID')})
								.then((res) => {
									if(res.code === 200) {
										Taro.hideLoading()
										this.codeBtnStore.countDown()
									}
								})
						}
					})
			})
			.catch((err) => {
				Taro.showToast({
					title: err,
					icon: 'none'
				})
			})
	}
	handleSubmit () {
		const { code, phone, imgCode, password } = this.state
		Promise.all([regPhone(phone), regNull(imgCode, '请输入图形验证码'), regNull(code, '请输入短信验证码'), regNull(password, '请输入密码')])
			.then((res) => {
				Taro.showLoading({
					title: 'Loading...'
				})
				api.post('/phoneLogin/registered', {code, username: phone, telephone: phone, password, companyId: Taro.getStorageSync('COMPANY_ID')})
					.then((res) =>{
						if(res.code === 200) {
							Taro.hideLoading()
							Taro.navigateBack({
								delta: 1
							})
						}
					})
			})
			.catch((err) => {
				Taro.showToast({
					title: err,
					icon: 'none'
				})
			})
	}
	render() {
		const { data, phone, code, imgCode, imgCodeUrl, password } = this.state
		const { txt, disabled } = this.codeBtnStore

		return (
			<View className='page'>
				<View className='header'>
					<Image className='img' src={data.logo} />
					<Text className='txt'>{data.name}</Text>
					<Text className='txt'>欢迎您</Text>
				</View>
				<View className='tab'>
					<InputItem
				    name='phone'
				    icon={images.phoneIcon}
				    type='phone'
				    placeholder='请填写您的手机号'
				    value={phone}
				    onChange={this.handleChange.bind(this,'phone')}
				    border={false}
				  />
				  <InputItem
				    name='imgCode'
				    icon={images.megIcon}
				    type='text'
				    placeholder='请输入图形验证码'
				    value={imgCode}
				    onChange={this.handleChange.bind(this,'imgCode')}
				    border={false}
				    right={true}
				    renderRight={
				    	<Image onClick={this.getImgCodeUrl.bind(this)} className='imgCode' src={imgCodeUrl} />
				    }
				  />
				  <InputItem
				    name='code'
				    icon={images.shieldIcon}
				    type='number'
				    placeholder='请输入验证码'
				    value={code}
				    onChange={this.handleChange.bind(this,'code')}
				    border={false}
				    renderRight={
				    	<AtButton 
								onClick={this.handleGetCodeClick.bind(this)} 
								type='primary' 
								size='small'
								disabled={disabled}
							>
								{txt}
							</AtButton>
				    }
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
				<AtButton onClick={this.handleSubmit.bind(this)} className='submit' type='primary'>注册</AtButton>
			</View>
		)
	}
}

export default Register