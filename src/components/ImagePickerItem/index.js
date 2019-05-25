import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { baseUrl } from '../../service/config'

import './index.scss'

class ImagePickerItem extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
	  	maxCount: 9,
	  	images: this.props.value || []
	  }
	}
	
	handleChooseImage () {
		const { images, maxCount } = this.state
		if(images.length <= maxCount){
			Taro.chooseImage({
				count: maxCount-images.length,
				sizeType: ['original', 'compressed'],
  			sourceType: ['album', 'camera'],
				success: (res) => {
					if(images.length + res.tempFilePaths.length <= maxCount){
						let chooseImages = []
						Taro.showLoading({
							title: 'Loading...',
						})
						res.tempFilePaths.forEach((img) => {
							Taro.uploadFile({
								url: `${baseUrl}/fileUpload`,
								name: 'template-icon',
								filePath: img,
								header: {
									XDD_TOKEN: Taro.getStorageSync('TOKEN'),
									Cookie: Taro.getStorageSync('SESSION_ID'),
								}
							})
							.then((result) => {
								if(result.statusCode === 200) {
									const data = JSON.parse(result.data)
									if(data.code === 200) {
										chooseImages.push(data.data)
										if(chooseImages.length === res.tempFilePaths.length) {
											Taro.hideLoading()
											this.setState({
												images: [...images, ...chooseImages]
											})
											this.props.onChange({
												detail:{
													value: [...images, ...chooseImages]
												}
											})
										}
									}else {
										Taro.showToast({
											title: '文件上传失败',
											icon: 'none'
										})
									}
								}else {
									Taro.showToast({
										title: '文件上传失败',
										icon: 'none'
									})
								}
							})
							.catch((err) => {
								Taro.showToast({
									title: '文件上传失败',
									icon: 'none'
								})
							})
						})
					}else {
						Taro.showToast({
							title: `最多选取${maxCount}张图片`,
							icon: 'none'
						})
					}
				},
				fail: (err) => {
					console.log(err)
				}
			})
		}
	}
	handleCloseImg (i) {
		const { images } = this.state
		const newImages = images.filter((item, index) => {
			return i !== index
		})
		this.setState({
			images: newImages
		})
	}
	handleReadImage (img) {
		Taro.previewImage({
			urls: this.state.images,
			current: img
		})
	}
	render() {
		return (
			<View className='image-picker-item'>
				<View className='title'>
					{this.props.required && 
						<Text className='required'>*</Text>
					}
					{this.props.title && 
						<Text className='txt'>{this.props.title}</Text>
					}
					
				</View>
				<View className='img-list'>
					{this.state.images.map((img, index) => 
						<View key={index} className='choose-item choose-img'>
							<View className='close' onClick={this.handleCloseImg.bind(this,index)}>
								<Image className='img' src={require('../../assets/images/close.svg')} />
							</View>
							<Image onClick={this.handleReadImage.bind(this, img)} className='img' src={img} />
						</View>
					)}
					{this.state.images.length < this.state.maxCount && 
						<View onClick={this.handleChooseImage.bind(this)} className='choose-item choose-btn' />
					}
				</View>
			</View>
		)
	}
}

export default ImagePickerItem