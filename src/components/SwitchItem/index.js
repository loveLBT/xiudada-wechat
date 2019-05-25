import Taro, { Component } from '@tarojs/taro'
import { View, Switch } from '@tarojs/components'

import './index.scss'

class MultiSelectorItem extends Component {
	render() {
		return (
			<View className='switch-item'>
				<View className='title'>
      		{this.props.required && 
      			<Text className='required'>*</Text>
      		}
      		<Text className='txt'>{this.props.title}</Text>
      	</View>
      	
      	<Switch onChange={this.props.onChange} checked={this.props.checked} color='#3ccba6' />
			</View>
		)
	}
}

export default MultiSelectorItem