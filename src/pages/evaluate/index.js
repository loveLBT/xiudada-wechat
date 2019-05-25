import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import TextAreaItem from '../../components/TextAreaItem'
import InputItem from '../../components/InputItem'
import ImagePickerItem from '../../components/ImagePickerItem'
import PickerItem from '../../components/PickerItem'
import RateItem from '../../components/RateItem'
import CustomForm from '../../components/CustomForm'
import * as images from '../../util/requireImages'
import api from '../../service/api'
import './index.scss'

const SolveProblemOptions = [
	{label: '已解决', value: 1},
	{label: '未解决', value: 0}
]

class Evaluate extends Component {
	config = {
    navigationBarTitleText: '服务评价'
  }
  constructor(props) {
    super(props)
  
    this.state = {
    	attitude: 5,
    	isSolveProblem: 1,
    	pics: [],
    	quality : 5,
    	remark: '',
    	speed: 5,
    	fields: []
    }
  }
  componentDidMount () {
  	Taro.showLoading({
  		title: 'Loading...'
  	})
  	Promise.all([this.getFields()])
  		.then((res) => {
  			Taro.hideLoading()
  		})
  }
  getFields () {
  	const { orderId } = this.$router.params
  	api.get('/order/evalExtField',{orderId})
  		.then((res) => {
  			if(res.code === 200) {
  				this.setState({
  					fields: res.data.list
  				})
  			}
  		})
  }
  handleChange (key, e) {
  	this.setState({
  		[key]: e.detail.value
  	})
  }
  handleCancelClick () {
  	Taro.navigateBack({
  		delta: 1
  	})
  }
  handleConfirmClick () {
  	const { attitude, isSolveProblem, pics, quality, remark, speed } = this.state
  	const { orderId, orderNo, workerId } = this.$router.params
  	Promise.all([this.customForm.checkForm()])
  		.then((res) => {
  			Taro.showLoading({
		  		title: 'Loading...'
		  	})
		  	api.post('/order/saveEval',{
		  		attitude: attitude * 20,
		  		isSolveProblem: isSolveProblem ? true : false,
		  		createEvalTime: (new Date()).valueOf(),
		  		fields: this.customForm.state.fieldForm,
		  		orderId,
		  		pics,
		  		quality: quality * 20,
		  		remark,
		  		speed: speed * 20,
		  		workerId
		  	})
		  	.then((res) => {
		  		if(res.code === 200) {
		  			Taro.showToast({
		  				title: '评价成功'
		  			})
		  			this.handleCancelClick()
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
		const { attitude, isSolveProblem, pics, quality, remark, speed, fields } = this.state
		const { orderTitle, eServiceSuggestionView } = this.$router.params

		return (
			<View className='page'>
				<View className='evaluate-logo'>
					<Image className='img' src={images.evaluate} />
				</View>
				<View className='form'>
					<InputItem
				    title='工单标题'
				    type='text'
				    value={orderTitle}
				    disabled={true}
				  />
				  <PickerItem 
						value={isSolveProblem}
				  	title='您的问题是否解决'
				  	required={true}
				  	data={SolveProblemOptions}
				  	onChange={this.handleChange.bind(this,'isSolveProblem')}
				  	placeholder='请选择'
				  	leftStyle={{flex: 1}}
				  	rightStyle={{flex: 'none'}}
				  />
				  <RateItem 
				  	title='服务质量'
				  	value={quality}
				  	required={true}
				  	onChange={this.handleChange.bind(this, 'quality')}
				  />
				  <RateItem 
				  	title='服务态度'
				  	value={attitude}
				  	required={true}
				  	onChange={this.handleChange.bind(this, 'attitude')}
				  />
				  <RateItem 
				  	title='处理速度'
				  	value={speed}
				  	required={true}
				  	onChange={this.handleChange.bind(this, 'speed')}
				  />
				  {eServiceSuggestionView && 
				  	<TextAreaItem 
					  	title='建议与评价'
					  	value={remark}
					  	onChange={this.handleChange.bind(this,'remark')}
					  	required={false}
					  />
				  }
				  
				  {fields.length > 0 && 
				  	 <CustomForm ref={ref=>this.customForm=ref} data={fields} />
				  }
				</View>
				<View className='actions'>
					<View onClick={this.handleCancelClick.bind(this)} className='btn cancel-btn'>
						<Text className='txt'>取消</Text>
					</View>
					<View onClick={this.handleConfirmClick.bind(this)} className='btn confirm-btn'>
						<Text className='txt'>确定</Text>
					</View>
				</View>
			</View>
		)
	}
}

export default Evaluate