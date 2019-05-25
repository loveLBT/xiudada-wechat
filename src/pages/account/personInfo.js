import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import './index.scss'

class PersonInfo extends Component {
	config = {
    navigationBarTitleText: '用户信息'
  }
  constructor(props) {
    super(props)
  
    this.state = {
    	username: '',
    	phone: '',
    	password: ''
    }
  }
  handleChange (key, value) {
  	this.setState({
  		[key]: value
  	})
  }
	render() {
		return (
			<View className='page'>
				<View className='form'>
					<AtInput
				    name='username'
				    title='用户名'
				    type='text'
				    placeholder='请输入用户名'
				    value={username}
				    onChange={this.handleChange.bind(this,'username')}
				  />
				  <AtInput
				    name='phone'
				    title='手机号'
				    type='phone'
				    placeholder='请输入手机号'
				    value={phone}
				    onChange={this.handleChange.bind(this,'phone')}
				  />
				  <AtInput
				    name='password'
				    title='密码'
				    type='password'
				    placeholder='请输入密码'
				    value={password}
				    onChange={this.handleChange.bind(this,'password')}
				  />
				</View>
			</View>
		)
	}
}

export default PersonInfo