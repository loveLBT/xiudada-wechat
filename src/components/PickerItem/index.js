import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import './index.scss'

class PickerItem extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
	  	selectIndex: 0,
	  	val: ''
	  }
	}
	componentDidMount () {
		const { value, data } = this.props
		if(value) {
			let index = data.findIndex((item) => item.value === value)

			this.setState({
				selectIndex: index,
				val: data[index].label
			})			
		}
	}
	handleChange (e) {
		const { data } = this.props
		this.setState({
			selectIndex: e.detail.value,
			val: data[e.detail.value].label,
		})
		this.props.onChange({
			detail:{
				value: data[e.detail.value].value
			}
		})
	}
	render() {
		
		return (
			<View className='picker-item'>
				<Picker
					value={this.state.selectIndex}
					mode='selector'
					range={this.props.data}
					rangeKey='label'
					onChange={this.handleChange.bind(this)}
				>
					<View className='picker'>
						<View className='left' style={this.props.leftStyle}>
          		{this.props.required && 
          			<Text className='required'>*</Text>
          		}
          		<Text className='title'>{this.props.title}</Text>
          	</View>
          	{this.state.val ? 
          		<Text style={this.props.rightStyle} className='value'>{this.state.val}</Text> :
          		<Text style={this.props.rightStyle} className='value'>{this.props.placeholder || `请选择${this.props.title}`}</Text>
          	}
          	<AtIcon value='chevron-right' size='22' color='#999'></AtIcon>
					</View>
				</Picker>
				
			</View>
		)
	}
}
PickerItem.defaultProps = {
	leftStyle: {},
	rightStyle: {flex: 1}
}
export default PickerItem