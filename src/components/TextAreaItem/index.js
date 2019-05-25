import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtTextarea } from 'taro-ui'
import classnames from 'classnames'

import './index.scss'

class TextAreaItem extends Component {
	render() {
		return (
			<View className={classnames('textarea-item',{border: this.props.border})}>
				<View className='title'>
					{this.props.required && 
						<Text className='required'>*</Text>
					}
					{this.props.title && 
						<Text className='txt'>{this.props.title}</Text>
					}
				</View>
				<AtTextarea
	        value={this.props.value}
	        onChange={this.props.onChange}
	        maxLength={200}
	        placeholder={this.props.placeholder || '请输入...'}
	      />
			</View>
		)
	}
}
TextAreaItem.defaultProps = {
	border: true
}

export default TextAreaItem