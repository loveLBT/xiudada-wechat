import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import InputItem from '../InputItem/'
import PickerItem from '../../components/PickerItem'
import DatePickerItem from '../../components/DatePickerItem'
import SwitchItem from '../../components/SwitchItem'
import MultiSelectorItem from '../../components/MultiSelectorItem'
import AddressPickerItem from '../../components/AddressPickerItem'
import ImagePickerItem from '../../components/ImagePickerItem'
import ScannerItem from '../../components/ScannerItem'
import { formatTime } from '../../util/common'
import './index.scss'

class CustomForm extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
	  	fieldList: [],
	  	fieldForm: []
	  }
	}
	componentWillMount () {
		this.filterData()
	}
	filterData () {
		const { data } = this.props
		let fieldList = []
		data.forEach((item) => {
			let newItem = {...item}
			if([8,9,10].indexOf(item.type) !== -1){
				if(item.options){
					newItem.ovalue = item.options.split(',')
				}else{
					newItem.ovalue = []
				}
			}else if([7].indexOf(item.type) !== -1){
				newItem.ovalue = Boolean(item.options)
			}else if([4,5,6].indexOf(item.type) !== -1){
				if(item.type === 4) {
					newItem.ovalue = item.options ? formatTime(new Date(item.options), 'YYYY-MM-DD') : formatTime(new Date(), 'YYYY-MM-DD')
				}else if(item.type === 5) {
					newItem.ovalue = item.options ? formatTime(new Date(item.options), 'HH:mm') : formatTime(new Date(), 'HH:mm')
				}else if(item.type === 6){
					newItem.ovalue = item.options ? formatTime(new Date(item.options), 'YYYY-MM-DD HH:mm:ss') : formatTime(new Date(), 'YYYY-MM-DD HH:mm:ss')
				}
			}else {
				newItem.ovalue = item.tfvvalue
			}
			fieldList.push(newItem)
		})

		this.setState({
			fieldList
		},() => {
			let fieldForm = []
			for (let item of this.state.fieldList){
				let value = ''
				if([4,5,6].indexOf(item.type) !== -1) {
					value = (new Date(item.options)).valueOf()
				}else {
					value = item.options
				}
				fieldForm.push({
					tempFieldId: item.id,
					type: item.type,
					value: value
				})
			}
			this.setState({
				fieldForm
			})
		})
	}
	handleChange (index, val) {
		let fieldForm = [...this.state.fieldForm]
		let fieldList = [...this.state.fieldList]
		fieldForm[index].value = val
		fieldList[index].ovalue = val
		this.setState({
			fieldForm,
			fieldList
		})
	}
	checkForm () {
		const { fieldForm, fieldList } = this.state
		let eachState = true
		return new Promise((resolve, reject) => {
			fieldList.forEach((item,index) => {
				if(item.isRequired && !fieldForm[index].value){
					reject(`${item.name}不能为空`)
					eachState = false
					return false
				}
			})
			if(eachState) {
				resolve(true)
			}
		})
	}
	render () {
		const { fieldList } = this.state

		return (
			<View className='custom-form'>
				{fieldList.map((item, index) => {
					switch (item.type) {
						case 1: {
							return (
								<InputItem
									key={index}
							    title={item.name}
							    type='text'
							    placeholder={`请输入${item.name}`}
							    value={item.ovalue}
							    onChange={(e)=>{
							    	this.handleChange(index, e.detail.value)
							    }}
							    required={item.isRequired}
							  />
							)
							break							
						}
						case 2: {
							return (
								<InputItem
									key={index}
							    title={item.name}
							    type='number'
							    placeholder={`请输入${item.name}`}
							    value={item.ovalue}
							    onChange={(e)=>{
							    	this.handleChange(index, e.detail.value)
							    }}
							    required={item.isRequired}
							  />
							)
							break
						}
						case 3: {
							let options = []
							if(item.dropList) {
								item.dropList.forEach((item,index) => {
									options.push({
										label: opt.value,
										value: opt.id
									})
								})
							}
							
							return (
								<PickerItem 
									key={index}
									value={item.ovalue}
							  	title={item.name}
							  	required={item.isRequired}
							  	data={options}
							  	onChange={(e)=>{
							    	this.handleChange(index, e.detail.value)
							    }}
							  />
							)
							break
						}
						case 4: {
							return (
								<DatePickerItem 
									key={index}
									title={item.name}
							  	mode='date'
							  	value={item.ovalue}
							  	onChange={(e) => {
							  		this.handleChange(index, e.detail.value)
							  	}}
							  	required={item.isRequired}
							  />
							)
							break
						}
						case 5: {
							return (
								<DatePickerItem 
									key={index}
									title={item.name}
							  	mode='time'
							  	value={item.ovalue}
							  	onChange={(e) => {
							  		this.handleChange(index, e.detail.value)
							  	}}
							  	required={item.isRequired}
							  />
							)
							break
						}
						case 6: {
							return (
								<DatePickerItem 
									key={index}
									title={item.name}
							  	mode='dateTime'
							  	value={item.ovalue}
							  	onChange={(e) => {
							  		this.handleChange(index, e.detail.value)
							  	}}
							  	required={item.isRequired}
							  />
							)
							break
						}
						case 7: {
							return (
								<SwitchItem 
									key={index}
							  	title={item.name}
							  	checked={item.ovalue}
							  	required={item.isRequired}
							  	onChange={(e) => {
							  		this.handleChange(index, e.detail.value)
							  	}}
							  />
							)
							break
						}
						case 8: {
							let options = []
							if(item.dropList) {
								item.dropList.forEach((opt) => {
									options.push({
										label: opt.value,
										value: opt.id
									})
								})
							}
							return (
								<MultiSelectorItem
									key={index} 
							  	title={item.name}
							  	required={item.isRequired}
							  	data={options}
							  	value={item.ovalue}
							  	onChange={(e) => {
							  		this.handleChange(index, e.detail.value.join(','))
							  	}}
							  />
							)
							break
						}
						case 9: {
							return (
								<AddressPickerItem 
									key={index}
									title={item.name}
							  	value={item.ovalue}
							  	onChange={(e) => {
							  		this.handleChange(index, e.detail.value.join(','))
							  	}}
							  	required={item.isRequired}
							  />
							)
							break
						}
						case 10: {
							return (
								<ImagePickerItem 
									key={index}
							  	title={item.name}
							  	images={item.ovalue}
							  	onChange={(e) => {
							  		this.handleChange(index, e.detail.value.join(','))
							  	}}
							  	required={item.isRequired}
							  />
							)
							break
						}
						case 12: {
							return (
								<ScannerItem 
									key={index}
							  	name='code'
							  	title='扫码输入'
							  	value={item.ovalue}
							  	onChange={(e) => {
							  		this.handleChange(index, e.detail.value)
							  	}}
							  	required={item.isRequired}
							 	/>
							)
							break
						}
					}
				})}
			</View>
		)
	}
}

export default CustomForm