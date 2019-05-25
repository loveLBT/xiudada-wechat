import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import ImagePickerItem from '../../components/ImagePickerItem'
import TextAreaItem from '../../components/TextAreaItem'
import api from '../../service/api'
import './index.scss'

class OrderMessage extends Component {
	config = {
    navigationBarTitleText: '工单留言'
  }
  constructor(props) {
    super(props)
  
    this.state = {
    	message: '',
    	imgList: []
    }
  }
  handleChange (key, e) {
  	this.setState({
  		[key]: e.detail.value
  	})
  }
  handleCancelClick () {
  	Taro.navigateBack({
  		delta: 1
  	})
  }
  handleConfirmClick () {
  	const { message, imgList } = this.state
  	const { orderId } = this.$router.params
  	if(!message) {
  		Taro.showToast({
  			title: '留言内容不能为空',
  			icon: 'none'
  		})
  	}else {
  		Taro.showLoading({
	  		title: 'Loading...'
	  	})
	  	api.post('/order/message',{content: message, pics: imgList, orderId})
	  		.then((res) => {
	  			if(res.code === 200) {
	  				this.handleCancelClick()
	  				Taro.showToast({
	  					title: '保存成功'
	  				})
	  			}
	  		})
  	}
  	
  }
	render() {
		const { message, imgList } = this.state
		return (
			<View className='order-message'>
				<View className='item'>
					<TextAreaItem 
				  	title='工单留言'
				  	value={message}
				  	onChange={this.handleChange.bind(this,'message')}
				  	required={true}
				  />
				</View>
				<View className='item'>
					<ImagePickerItem 
				  	onChange={this.handleChange.bind(this,'imgList')}
				  	images={imgList}
				  	title='图片描述'
				  	value={imgList}
				  	required={false}
				  />
				</View>
				<View className='actions'>
					<View onClick={this.handleCancelClick.bind(this)} className='btn cancel-btn'>
						<Text className='txt'>取消</Text>
					</View>
					<View onClick={this.handleConfirmClick.bind(this)} className='btn confirm-btn'>
						<Text className='txt'>确定</Text>
					</View>
				</View>
			</View>
		)
	}
}

export default OrderMessage