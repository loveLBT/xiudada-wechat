import Taro, { Component } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'

import InputItem from '../InputItem'
import './index.scss'

class ScannerInputItem extends Component {
	handleScanCode () {
  	Taro.scanCode({
  		onlyFromCamera: true,
  		scanType: ['barCode', 'qrCode'],
  		success: (res) => {
  			this.props.onChange({
  				detail: {
  					value :res
  				}
  			})
  		},
  		fail: (err) => {
  			Taro.showToast({
  				title: '未知错误',
  				icon: 'none'
  			})
  		}
  	})
  }
	render() {
		const { name, placeholder, value, title, required } = this.props
		return (
			<InputItem
		    name={name}
		    title={title}
		    type='text'
		    placeholder={placeholder || '请输入二维码号码'}
		    value={value}
		    onChange={this.props.onChange}
		    border={false}
		    right={true}
		    required={required}
		    renderRight={
		    	<View  
		    		className='code-btn'
		    		onClick={this.handleScanCode.bind(this)}
		    	>
		    		<Image className='img' src={require('../../assets/images/code.png')} />
		    	</View>
		    }
		  />
		)
	}
}
export default ScannerInputItem