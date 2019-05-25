import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import data from './data'
import './index.scss'

class AddressPickerItem extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
	  	multiArray: [],				//显示的[省,市,区]数组
   	 	multiIndex: [0,0,0],	//滑动后定位的下标数组
   	 	val: ''   						//展示数据
	  }
	}
	componentDidMount () {
		this.initPicker()
	}
	initPicker () {
		if(this.props.value) {
			let provinces = data
			let citys = provinces[0].children
			let areas = citys[0].children
			let multiIndex = [0,0,0]
			let vals = []

			if(this.props.value[0]) {
				multiIndex[0] = provinces.findIndex((item) => item.value === this.props.value[0])
				vals.push(provinces[multiIndex[0]].label)
			}

			if(this.props.value[1]) {
				multiIndex[1] = provinces[multiIndex[0]].children.findIndex((item) => item.value === this.props.value[1])
				citys = provinces[multiIndex[0]].children
				vals.push(citys[multiIndex[1]].label)
			}else {
				citys = provinces[0].children
			}

			if(this.props.value[2]) {
				multiIndex[2] = citys[multiIndex[1]].children.findIndex((item) => item.value === this.props.value[2])
				areas = citys[multiIndex[1]].children
				vals.push(areas[multiIndex[2]].label)
			}else {
				areas = citys[0].children
			}

			this.setState({
				multiArray: [provinces, citys, areas],
				multiIndex,
				val:vals.join(' ')
			}) 
		}else {
			console.log('组件value值必填')
		}
		
	}
	handleChange (e) {
		let multiIndex = e.detail.value
		let province = data[multiIndex[0]]
		let city = province.children[multiIndex[1]]
		let area = city.children[multiIndex[2]]
		let value = [province.value, city.value, area.value]
		let val = [province.label, city.label, area.label].join(' ')

		this.props.onChange({
			detail:{
				value:value
			}
		})

		this.setState({
			val,
			multiIndex
		})
	}
	handleDateTimeColumn (e) {
		let multiArray = this.state.multiArray
		let multiIndex = this.state.multiIndex

		//更新滑动的第几列e.detail.column的数组下标值e.detail.value
		multiIndex[e.detail.column] = e.detail.value
		//如果更新的是第一列“省”，第二列“市”和第三列“区”的数组下标置为0
		if (e.detail.column === 0) {
			multiIndex = [e.detail.value,0,0]
		}else if(e.detail.column === 1) {
			//如果更新的是第二列“市”，第一列“省”的下标不变，第三列“区”的数组下标置为0
			multiIndex = [multiIndex[0], e.detail.value, 0]
		}else if(e.detail.column === 2) {
			//如果更新的是第三列“区”，第一列“省”和第二列“市”的值均不变。
			multiIndex = [multiIndex[0], multiIndex[1], e.detail.value]
		}

		if((data[multiIndex[0]].children).length > 0) {
			//如果第二列“市”的个数大于0,通过multiIndex变更multiArray[1]的值
			multiArray[1] = data[multiIndex[0]].children
			const areas = (data[multiIndex[0]].children[multiIndex[1]]).children
			if(areas.length > 0) {
				//如果第二列“市”的个数大于0,通过multiIndex变更multiArray[1]的值
				multiArray[2] = areas
			}else {
				//如果第三列“区”的个数大于0,通过multiIndex变更multiArray[2]的值；否则赋值为空数组
				multiArray[2] = []
			}
		}else {
			//如果第二列“市”的个数不大于0，那么第二列“市”和第三列“区”都赋值为空数组
			multiArray[1] = []
			multiArray[2] = []
		}

		this.setState({
			multiIndex,
			multiArray
		})
	}
	render() {
		return (
			<View className='address-picker-item'>
				<Picker
					value={this.state.multiIndex}
					mode='multiSelector'
					range={this.state.multiArray}
					rangeKey='label'
					onChange={this.handleChange.bind(this)}
					onColumnChange={this.handleDateTimeColumn.bind(this)}
				>
          <View className='picker'>
          	<View className='left'>
          		{this.props.required && 
          			<Text className='required'>*</Text>
          		}
          		<Text className='title'>{this.props.title}</Text>
          	</View>
          	{this.state.val ? 
          		<Text className='value'>{this.state.val}</Text> :
          		<Text className='value'>{this.props.placeholder || '请选择地址'}</Text>
          	}
          	<AtIcon value='chevron-right' size='22' color='#999'></AtIcon>
          </View>
        </Picker>
			</View>
		)
	}
}

export default AddressPickerItem