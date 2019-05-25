import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtRate }  from 'taro-ui'

import './index.scss'

class RateItem extends Component {
	handleChange (value) {
		this.props.onChange({
			detail: {
				value
			}
		})
	}
	render() {
		return (
			<View className='rate-item'>
				<View className='title'>
      		{this.props.required && 
      			<Text className='required'>*</Text>
      		}
      		<Text className='txt'>{this.props.title}</Text>
      	</View>
      	<AtRate
	        value={this.props.value}
	        onChange={this.handleChange.bind(this)}
	        size={20}
	        max={5}
	        margin={12}
	      />
			</View>
		)
	}
}

export default RateItem