import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'

import * as images from '../../util/requireImages'
import './index.scss'

class Account extends Component {
	config = {
    navigationBarTitleText: '我的'
  }

  handleItemClick (url) {
  	Taro.navigateTo({
      url: url
    })
  }
	render() {
		const { editNameModalState } = this.state
		const userInfo = JSON.parse(Taro.getStorageSync('USER_INFO'))

		return (
			<View className='page'>
				<AtList>
					<AtListItem
				    title='姓名'
				    thumb={images.accountUser}
				    extraText={userInfo.username}
				  />
				  <AtListItem
				    title='手机'
				    thumb={images.accountPhone}
				    extraText={userInfo.telephone}
				  />
				</AtList>
			</View>
		)
	}
}

export default Account