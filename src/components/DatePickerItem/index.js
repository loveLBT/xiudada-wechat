import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import { dateTimePicker, getMonthDay } from './picker'
import './index.scss'

class DatePickerItem extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
	  	dateType: 'date',
	  	startYear: 1970,
	  	endYear: 2100,
	  	dateTimeArray: [],
	  	dateTime: [],
	  	value: this.props.value
	  }
	}
	componentDidMount	() {
		if(['dateTime', 'dateTimes'].indexOf(this.props.mode) !== -1){
			let obj = dateTimePicker(this.state.startYear, this.state.endYear)
	    if(this.props.mode === 'dateTime'){
	     	// 精确到分的处理，将数组的秒去掉
	    	let lastArray = obj.dateTimeArray.pop();
    		let lastTime = obj.dateTime.pop();
	    }
	    this.setState({
	    	dateType: 'multiSelector',
	    	dateTime: obj.dateTime,
	    	dateTimeArray: obj.dateTimeArray
	    })

		}else if(['tiem', 'date'].indexOf(this.props.mode) !== -1) {
			this.setState({
				dateType: this.props.mode
			})
		}
	}
	handleDateTimeColumn (e) {
		let arr = this.state.dateTime 
		let dateArr = this.state.dateTimeArray
		let val = null

		arr[e.detail.column] = e.detail.value
		dateArr[2] = getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]])
		val = dateArr[0][arr[0]] + '-' + dateArr[1][arr[1]] + '-' +
					dateArr[2][arr[2]] + ' ' + dateArr[3][arr[3]] + ':' +
					dateArr[4][arr[4]]
		if(this.props.mode === 'dateTimes') {
			val += ':' + dateArr[5][arr[5]]
		}
		this.setState({
			dateTimeArray: dateArr,
      dateTime: arr,
      value: val
		})
	}
	handleChange (e) {
		if(['date', 'time'].indexOf(this.props.mode) !== -1) {
			this.props.onChange(e)
		}else if(['dateTime', 'dateTimes'].indexOf(this.props.mode) !== -1){
			this.props.onChange({
				detail:{
					value: this.state.value
				}
			})
		}
	}
	render() {

		return (
			<View className='date-picker-item'>
				<Picker
					value={this.state.dateTime} 
					mode={this.state.dateType}
					onChange={this.handleChange.bind(this)}
					range={this.state.dateTimeArray}
					onColumnChange={this.handleDateTimeColumn.bind(this)}
				>
          <View className='picker'>
          	<View className='left'>
          		{this.props.required && 
          			<Text className='required'>*</Text>
          		}
          		<Text className='title'>{this.props.title}</Text>
          	</View>
          	{this.state.value ? 
          		<Text className='value'>{this.state.value}</Text> :
          		<Text className='value'>{this.props.placeholder || '请选择时间'}</Text>
          	}
          	<AtIcon value='chevron-right' size='22' color='#999'></AtIcon>
          </View>
        </Picker>
			</View>
		)
	}
}

export default DatePickerItem