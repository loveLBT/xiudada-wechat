import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'

import './index.scss'

class ImageList extends Component {
	handleReadImage (img) {
		Taro.previewImage({
			urls: this.props.data,
			current: img
		})
	}
	render() {
		return (
			<View className='img-list'>
				{this.props.data && this.props.data.map((item, index) => 
					<Image onClick={this.handleReadImage.bind(this, item)} key={index} className='img' src={item} />
				)}
			</View>
		)
	}
}

export default ImageList