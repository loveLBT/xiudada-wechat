import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtInput } from 'taro-ui'

import './index.scss'

class InputItem extends Component {
	handleChange (value) {
		this.props.onChange({
			detail:{
				value
			}
		})
	}
	render() {
		const { name, type, placeholder, value, icon, title, border, required, right=false, disabled } = this.props

		return (
			<View className='input-item border'>
				{title && 
					<View className='left-box'>null</View>
				}
				{icon && 
					<View className='left-box-2'>null</View>
				}
				{right && 
					<View className='right-box'>null</View>
				}
				<View className={title ? 'titleLeft' : 'iconLeft'}>
					{icon && 
						<Image className='img' src={icon} />
					}
					{required && 
						<Text className='required'>*</Text>
					}
					{title && 
						<Text className='title'>{title}</Text>
					}
				</View>
				<View className='right'>
			  	{this.props.renderRight}
			  </View>
				<AtInput
			    name={name}
			    type={type}
			    placeholder={value ? null : placeholder}
			    value={value}
			    onChange={this.handleChange.bind(this)}
			    border={false}
			    disabled={disabled}
			  />
			</View>
		)
	}
}

export default InputItem