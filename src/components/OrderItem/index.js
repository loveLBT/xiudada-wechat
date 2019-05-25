import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import './index.scss'

class OrderItem extends Component {
	render() {
		return (
			<View onClick={this.props.onClick} className='order-item'>
				<Text className='title'>{this.props.title}</Text>
				<Text className='txt'>工单号：{this.props.orderNo}</Text>
				<Text className='txt'>模板名称：{this.props.tempName}</Text>
				<Text className='txt'>服务项目：{this.props.serviceName}</Text>
				<View className='icon-row'>
					<AtIcon value='clock' size='14' color='#999'></AtIcon>
					<Text className='txt'>{this.props.estimateArriveTime}</Text>
				</View>
				{this.props.customDetailAddr && 
					<View className='icon-row'>
						<AtIcon value='map-pin' size='14' color='#999'></AtIcon>
						<Text className='txt'>{this.props.customDetailAddr}</Text>
					</View>
				}
				<Text className='status'>{this.props.stateName}</Text>
			</View>
		)
	}
}

export default OrderItem