import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtButton } from 'taro-ui'

import InputItem from '../../components/InputItem'
import DatePickerItem from '../../components/DatePickerItem'
import AddressPickerItem from '../../components/AddressPickerItem'
import ImagePickerItem from '../../components/ImagePickerItem'
import TextAreaItem from '../../components/TextAreaItem'
import CustomForm from '../../components/CustomForm'
import api from '../../service/api'
import { formatTime } from '../../util/common'
import './index.scss'

class OrderForm extends Component {
	config = {
    navigationBarTitleText: '工单填写'
  }
  static options = {
		addGlobalClass: true
	}
  constructor(props) {
    super(props)
  
    this.state = {
    	template: {},
    	cutomFormList: [],
    	title: '',
    	customName: '',
    	customPhone: '',
    	customApplyTime: formatTime(new Date(), 'YYYY-MM-DD HH:mm'),
    	address: [],
    	customDetailAddr: '',
    	imgList: [],
    	detailDesc: '',
    	addressType: 2,
    	customLinkPerson: ''
    }
  }
  componentDidMount () {
  	this.getData()
  }
  getData () {
  	const { tempId } = this.$router.params
  	Taro.showLoading({
  		title: 'Loading'
  	})
  	api.get(`/admin/template/cusTempField/${tempId}`)
  		.then((res) => {
  			if(res.code === 200) {
  				Taro.hideLoading()
  				this.setState({
  					template: res.data.template,
  					cutomFormList: res.data.list
  				})
  			}
  		})
  }
  handleChange (key, e) {
  	this.setState({
  		[key]: e.detail.value
  	})
  }
  checkForm () {
  	const { template, cutomFormList, title, customName, customPhone, customApplyTime, address, customDetailAddr, imgList, detailDesc, code } = this.state
  	return new Promise((resolve, reject) => {
  		if(!title){
  			reject('标题不能为空')
	  	}else if(template.oAppointmentView && !customApplyTime) {
	  		reject('预约时间不能为空')
	  	}else if(!customName) {
	  		reject('姓名不能为空')
	  	}else if(!customPhone) {
	  		reject('电话不能为空')
	  	}else if (!address.length > 0) {
	  		reject('服务地址不能为空')
	  	}else if(template.oImgView && !imgList.length > 0) {
	  		reject('图片描述不能为空')
	  	}else{
	  		resolve(true)
	  	}
  	})
  }
  handleSubmit () {
  	const { tempId, serviceId } = this.$router.params
  	const { template, cutomFormList } = this.state
  	Promise.all([this.checkForm(), this.customForm.checkForm()])
  		.then((res) => {
  			let data = {
	  			customId: Taro.getStorageSync('USER_ID'),
	  			orderTypeTempId: tempId,
	  			serviceId,
	  			listField: this.customForm.state.fieldForm
	  		}
  			for(let key in this.state) {
		  		if(['template', 'cutomFormList'].indexOf(key) === -1){
		  			if(key === 'address' && this.state.address.length > 0) {
		  				data.provId = this.state.address[0]
		  				data.cityId = this.state.address[1]
		  				data.districtId = this.state.address[2] 
		  			}else if(key === 'customApplyTime') {
		  				data.customApplyTime = (new Date(this.state.customApplyTime)).valueOf()
		  			}else{
		  				data[key] = this.state[key]
		  			}
		  		}
		  	}

		  	Taro.showLoading({
		  		title: 'Loading...'
		  	})
		  	api.post('/order/saveOrderFromWeb', data)
		  		.then((res) => {
		  			if(res.code === 200) {
		  				Taro.switchTab({
		  					url: '/pages/order/index'
		  				})
		  				.then(() => {
		  					Taro.showToast({
			  					title: '提交成功'
			  				})
		  				})
		  			}
		  		})
  		})
  		.catch((err) => {
  			Taro.showToast({
  				title: err,
  				icon: 'none'
  			})
  		})
  }
	render() {
		const { template, cutomFormList, title, customName, customPhone, customApplyTime, address, customDetailAddr, imgList, detailDesc } = this.state
		const { serviceName } = this.$router.params

		return (
			<View className='order-form'>
				<View className='form'>
					<InputItem
				    title='标题'
				    type='text'
				    placeholder='请输入标题'
				    value={title}
				    onChange={this.handleChange.bind(this,'title')}
				    border={false}
				    required={true}
				  />
				  {template.oAppointmentView && 
				  	<DatePickerItem 
					  	mode='dateTime'
					  	value={customApplyTime}
					  	onChange={this.handleChange.bind(this,'customApplyTime')}
					  	required={true}
					  	title='预约时间'
					  />
				  }
				  <InputItem
				    title='姓名'
				    type='text'
				    placeholder='请输入姓名'
				    value={customName}
				    onChange={this.handleChange.bind(this,'customName')}
				    border={false}
				    required={true}
				  />
				  <InputItem
				    title='电话'
				    type='phone'
				    placeholder='请输入电话'
				    value={customPhone}
				    onChange={this.handleChange.bind(this,'customPhone')}
				    border={false}
				    required={true}
				  />
				  {template.oServiceNameView && 
				  	<InputItem
					    title='服务项目'
					    type='text'
					    placeholder='请输入服务项目'
					    value={serviceName}
					    border={false}
					    required={template.oServiceNameRequired}
					    disabled={true}
					  />
				  }
				  <AddressPickerItem 
				  	value={address}
				  	onChange={this.handleChange.bind(this,'address')}
				  	required={true}
				  	title='服务地址'
				  />
				  {template.cDetailAddressView && 
				  	<InputItem
					    title='详细地址'
					    type='text'
					    placeholder='请输入详细地址'
					    value={customDetailAddr}
					    border={false}
					    required={false}
					    onChange={this.handleChange.bind(this,'customDetailAddr')}
					  />
				  }
				  {template.oDescriView && 
				  	<TextAreaItem 
					  	title='详细描述'
					  	value={detailDesc}
					  	onChange={this.handleChange.bind(this,'detailDesc')}
					  	required={false}
					  />
				  }
				  {template.oImgView && 
				  	<ImagePickerItem 
					  	onChange={this.handleChange.bind(this,'imgList')}
					  	images={imgList}
					  	title='图片描述'
					  	value={imgList}
					  	required={true}
					  />
				  }
				  {cutomFormList.length > 0 && 
				  	<CustomForm
				  		ref={ref=>this.customForm=ref} 
				  		data={cutomFormList} 
				  	/>
				  }
				</View>
				<View className='footer-btn'>
					<AtButton 
						onClick={this.handleSubmit.bind(this)} 
						type='primary'
					>
						确认预约
					</AtButton>
				</View>
			</View>
		)
	}
}

export default OrderForm