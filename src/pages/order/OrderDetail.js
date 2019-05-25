import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtTabs, AtTabsPane, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtRate } from 'taro-ui'
import classnames from 'classnames'

import ExtField from '../../components/ExtField'
import api from '../../service/api'
import ImageList from '../../components/ImageList'
import TextAreaItem from '../../components/TextAreaItem'
import ListViewFooter from '../../components/ListViewFooter'
import getDateDiff from '../../util/getDateDiff'
import './index.scss'

const TAB_LIST = [
		{ title: '工单信息' },
		{ title: '工单留言' }
	]

class OrderDetail extends Component {
	config = {
    navigationBarTitleText: '工单详情'
  }
  constructor(props) {
	  super(props)
	
	  this.state = {
	  	orderInfo: {},
	  	orderExtFields: [],
	  	evaluateExtField: [],
	  	workerList: [],
	  	template: {},
	  	orderMessage: [],
	  	tabCurrent: 0,
	  	isOpened: false,
	  	cancelTxt: '',
	  	tabList: TAB_LIST
	  }
	}
	componentDidShow () {
		this.getData()
	}
	getData () {
		Taro.showLoading({
			title: 'Loading...'
		})
		Promise.all([this.getOrderDetail(), this.getOrderMessage(), this.getEvaluateExtField()])
			.then((res) => {
				Taro.hideLoading()
			})
	}
	getEvaluateExtField () {
		const { orderId } = this.$router.params
		api.get('/order/evalFieldDetails',{orderId})
			.then((res) => {
				if(res.code === 200) {
					this.setState({
						evaluateExtField: res.data.list
					})
				}
			})
	}
	getOrderMessage () {
		const { orderId } = this.$router.params
		api.get('/order/message',{orderId})
			.then((res) => {
				if(res.code === 200){
					this.setState({
						orderMessage: res.data.list
					})
				}
			})
	}
	getOrderDetail () {
		const { orderId } = this.$router.params
		api.get('/order/orderDetail',{orderId})
			.then((res) => {
				if(res.code === 200){
					this.setState({
						orderInfo: res.data.orderInfo,
						orderExtFields: res.data.orderExtFields,
						tempalte: res.data.template,
						workerList: res.data.workerList
					},() => {
						this.setTabList()
					})
				}
			})
	}
	setTabList () {
		const { orderInfo } = this.state
		let newTabList = [...TAB_LIST]

		if([2,3,4,5,6].indexOf(orderInfo.state) !== -1) {
			newTabList.splice(1, 0, {title: '服务进度'})
		}
		if([5,6].indexOf(orderInfo.state) !== -1) {
			newTabList.splice(3, 0, {title: '客户评价'})
		} 
		this.setState({
			tabList: newTabList
		})
	}
	handleClick (value) {
		this.setState({
			tabCurrent: value
		})
	}
	handleMessageClick () {
		const { orderInfo } = this.state
		Taro.navigateTo({
			url: `/pages/order/OrderMessage?orderId=${orderInfo.id}`
		})
	}
	handleChange (key, e) {
		this.setState({
			[key]: e.detail.value
		})
	}
	showCancelOrderModal () {
		this.setState({
			isOpened: true
		})
	}
	closeCancelOrderModal () {
		this.setState({
			isOpened: false
		})
	}
	handleCancelOrderConfirm () {
		const { orderId } = this.$router.params
		const { cancelTxt } = this.state
		if(!cancelTxt) {
			Taro.showToast({
				title: '请输入取消原因',
				icon: 'none'
			})
		}else {
			Taro.showLoading({
				title: 'Loading...'
			})
			api.put('/order/cancel',{orderId, cancelCause: cancelTxt})
				.then((res) => {
					if(res.code === 200) {
						Taro.showToast({
							title: '工单取消成功'
						})
						this.getData()
					}
				})
		}
	}
	handleEvaluateClick () {
		const { orderInfo, template } = this.state
		Taro.navigateTo({
			url: `/pages/evaluate/index?orderId=${orderInfo.id}&orderNo=${orderInfo.orderNo}&workId=${orderInfo.workerId}&orderTitle=${orderInfo.title}&eServiceSuggestionView=${template.eServiceSuggestionView}`
		})
	}
	handleReadImage (imgs, img) {
		Taro.previewImage({
			urls: imgs,
			current: img
		})
	}
	render() {
		const { tabCurrent, orderInfo, template, orderExtFields, workerList, isOpened, orderMessage, tabList, evaluateExtField } = this.state

		return (
			<View className='order-detail'>
				<View className='info'>
					<Text className='title'>{orderInfo.title}</Text>
					<View className='row'>
						<Text className='label'>工单编号：</Text>
						<Text className='value'>{orderInfo.orderNo}</Text>
					</View>
					<View className='row'>
						<Text className='label'>客户名称：</Text>
						<Text className='value'>{orderInfo.customName}</Text>
					</View>
					<View className='row'>
						<Text className='label'>联系电话：</Text>
						<Text className='value'>{orderInfo.customPhone}</Text>
					</View>
					<View className='row'>
						<Text className='label'>服务地址：</Text>
						<Text className='value'>{orderInfo.gpsAddr}&ensp;{orderInfo.customDetailAddr}</Text>
					</View>
					<View className='row'>
						<Text className='label'>预约时间：</Text>
						<Text className='value'>{orderInfo.customApplyTime}</Text>
					</View>
					<Text className='status'>{orderInfo.stateName}</Text>
				</View>
				<AtTabs current={tabCurrent} tabList={tabList} onClick={this.handleClick.bind(this)}>
			    <AtTabsPane current={tabCurrent} index={0} >
			      <View className='order-info'>
							<View className='ext-field'>
								<View className='row'>
									<Text className='label'>工单模板</Text>
									<Text className='value'>{orderInfo.tempName}</Text>
								</View>
								<View className='row'>
									<Text className='label'>服务项目</Text>
									<Text className='value'>{orderInfo.serviceName}</Text>
								</View>
								<View className='row'>
									<Text className='label'>详细描述</Text>
									<Text className='value'>{orderInfo.detailDesc ? orderInfo.detailDesc : '-'}</Text>
								</View>
								<Fragment>
									<View className='row'>
										<Text className='label'>图片描述</Text>
										{!orderInfo.imgList && 
											<Text className='value'>-</Text>
										}
									</View>
									{orderInfo.imgList && 
										<ImageList data={orderInfo.imgList} />
									}
								</Fragment>
								<ExtField exitFields={orderExtFields} />
							</View>
						</View>
	        </AtTabsPane>
	        {[2,3,4,5,6].indexOf(orderInfo.state) !== -1 && 
	        	<AtTabsPane current={tabCurrent} index={1}>
	        		<View className='service-progress'>
	        			<Text className='title'>服务人员</Text>
	        			{workerList.map((item, index) => 
	        				<View key={index} className='wroker-info'>
		        				<View className='avatar'>
		        					{item.avatar ? 
		        						<Image className='img' src={require('../../assets/images/logo_icon.png')} /> :
		        						<Text className='txt'>{item.username.substr(item.username.length - 2)}</Text>
		        					}
		        				</View>
		        				<View className='nameAphone'>
		        					<Text className='name'>主负责人：{item.username}</Text>
		        					<Text className='phone'>联系电话：{item.telephone}</Text>
		        				</View>
		        			</View>
	        			)}
	        		</View>
	        	</AtTabsPane>
	        }
	        <AtTabsPane current={tabCurrent} index={2}>
	          <View className='message-list'>
	          	{orderMessage.length > 0 && orderMessage.map((item, index) =>
	          		<View key={index} className='message'>
		          		<View className='left'>
		          			<View className='avatar'>
		          				<Text className='txt'>{item.createName.substr(item.createName.length-2)}</Text>
		          			</View>
		          		</View>
		          		<View className='right'>
		          			<View className='cover'></View>
		          			<View className='msg-info'>
		          				<Text className='title'>{item.createName}【{getDateDiff(item.createTime)}】</Text>
		          				<Text className='content'>{item.content}</Text>
		          				<View className='img-list'>
	          						{item.pics.map((img, j) => 
	          							<Image onClick={this.handleReadImage.bind(this,item.pics,item)} className='img' src={img} key={j} />
	          						)}
		          				</View>
		          			</View>
		          			<Text className='time'>
		          				{item.createTime}
		          			</Text>
		          		</View>
		          	</View>
	          	)}
	          	{orderMessage.length === 0 && 
	          		<ListViewFooter state='Null' />
	          	}
	          </View>
	        </AtTabsPane>
	        {[5, 6].indexOf(orderInfo.state) !== -1 && 
	        	<AtTabsPane current={tabCurrent} index={3}>
	        		<View className='cutomer-evaluate'>
	        			{!orderInfo.evaluateState && 
	        				<View className='no-evaluate'>
		        				<Text className='tip-title'>本次服务已完成</Text>
		        				<Text className='tip-desc'>请对本次服务进行评价</Text>
		        			</View>
	        			}
	        			{orderInfo.evaluateState && 
	        				<View className='evaluate'>
	        					<View className='ext-field'>
	        						<View className='row'>
												<Text className='label'>是否解决</Text>
												<Text className='value'>{orderInfo.isSolveProblem ? '已解决' : '未解决'}</Text>
											</View>
											<View className='row'>
												<Text className='label'>服务质量</Text>
												<AtRate
									        value={Math.round((orderInfo.evaluateServiceQualityScore / 20) * 10) / 10}
									        size={20}
									        max={5}
									        margin={12}
									      />
											</View>
											<View className='row'>
												<Text className='label'>服务态度</Text>
												<AtRate
									        value={Math.round((orderInfo.evaluateServiceAttitudeScore / 20) * 10) / 10}
									        size={20}
									        max={5}
									        margin={12}
									      />
											</View>
											<View className='row'>
												<Text className='label'>处理速度</Text>
												<AtRate
									        value={Math.round((orderInfo.evaluateProcessSpeedScore / 20) * 10) / 10}
									        size={20}
									        max={5}
									        margin={12}
									      />
											</View>
											{template.eServiceSuggestionView && 
												<View className='row'>
													<Text className='label'>建议与评价</Text>
													<Text className='value'>{orderInfo.evaluateRemark}</Text>
												</View>
											}
											<ExtField exitFields={evaluateExtField} />
	        					</View>
	        				</View>
	        			}
	        		</View>
	        	</AtTabsPane>
	        }
	      </AtTabs>
	      <View className='actions'>
	      	<View onClick={this.handleMessageClick.bind(this)} className={classnames('s-btn',{'btn-flex': [4,6].indexOf(orderInfo.state) !== -1 || orderInfo.evaluateState})}>
	      		<Text className='txt'>留言</Text>
	      	</View>
	      	{[0, 1, 2, 3].indexOf(orderInfo.state) !== -1 && 
	      		<View onClick={this.showCancelOrderModal.bind(this)} className='b-btn btn-flex'>
		      		<Text className='txt'>取消工单</Text>
		      	</View>
	      	}
	      	{([5].indexOf(orderInfo.state) !== -1 && !orderInfo.evaluateState) &&
	      		<View onClick={this.handleEvaluateClick.bind(this)} className='b-btn btn-flex'>
		      		<Text className='txt'>服务评价</Text>
		      	</View>
	      	}
	      </View>
	      {isOpened && 
	      	<AtModal isOpened={true}>
					  <AtModalHeader>取消工单</AtModalHeader>
					  <AtModalContent>
					    <TextAreaItem 
						  	title=''
						  	placeholder='请填写工单取消原因'
						  	value={cancelTxt}
						  	onChange={this.handleChange.bind(this,'cancelTxt')}
						  	required={false}
						  	border={false}
						  />
					  </AtModalContent>
					  <AtModalAction> 
					  	<Button onClick={this.closeCancelOrderModal.bind(this)}>取消</Button>
					  	<Button onClick={this.handleCancelOrderConfirm.bind(this)}>确定</Button> 
					  </AtModalAction>
					</AtModal>
	      }
	      
			</View>
		)
	}
}

export default OrderDetail