import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabs, AtTabsPane  } from 'taro-ui'
import { observer } from '@tarojs/mobx'

import OrderItem from '../../components/OrderItem'
import ListViewStore from '../../store/ListViewStore'
import ListViewFooter from '../../components/ListViewFooter'
import './index.scss'

const tabList = [
	{ title: '已预约', value: '1' },
	{ title: '服务中', value: '2' },
	{ title: '待评价', value: '3' },
	{ title: '全部', value:'0' }
]

@observer
class Order extends Component {
	config = {
    navigationBarTitleText: '工单列表',
    enablePullDownRefresh: true,
    onReachBottomDistance: 50,
    backgroundTextStyle: 'dark'
  }
	constructor(props) {
	  super(props)
	
	  this.state = {
	  	current: 0,
	  	listViewStore0: null,
	  	listViewStore1: null,
	  	listViewStore2: null,
	  	listViewStore3: null
	  }
	}
	componentWillMount () {
		this.setStore()
	}
	onPullDownRefresh () {
		const { current } = this.state
		this.state[`listViewStore${current}`].beginHeaderRefresh()

	}
	onReachBottom () {
		const { current } = this.state
		this.state[`listViewStore${current}`].beginFooterRefresh()
	}
	setStore () {
		const { current } = this.state
		const store = new ListViewStore({
			getUrl: '/order/list',
			params: {
				customerId: Taro.getStorageSync('USER_ID'),
				state: tabList[current].value
			}
		})
		this.setState({
			[`listViewStore${current}`]: store 
		},() => {
			Taro.startPullDownRefresh()
		})
	}
	handleClick (value) {
		this.setState({
			current: value
		},() => {
			if(!this.state[`lisViewStore${value}`]) {
				this.setStore()
			}
		})
	}
	handleOrderItemClick (data) {
		Taro.navigateTo({
			url: `/pages/order/OrderDetail?orderId=${data.id}`
		})
	}
	render() {
		const { current, listViewStore0, listViewStore1, listViewStore2, listViewStore3 } = this.state
		const { data, footerState } = this.state[`listViewStore${current}`] || {}

		return (
			<View className="page">
				<AtTabs current={current} tabList={tabList} onClick={this.handleClick.bind(this)}>
					{tabList.map((tab, index) => {
						return (
							<AtTabsPane key={index} current={current} index={index} >
								<View className='scroll-view'>
									{data && data.slice().map((item, index) => 
										<OrderItem 
											onClick={this.handleOrderItemClick.bind(this, item)}
											title={item.title}
											orderNo={item.orderNo}
											tempName={item.tempName}
											serviceName={item.serviceName}
											estimateArriveTime={item.estimateArriveTime}
											customDetailAddr={item.customDetailAddr}
											stateName={item.stateName}
											key={index} 
										/>
									)}
									{footerState && 
										<ListViewFooter state={footerState} />
									}
								</View>
			        </AtTabsPane>
						)
					})}
	      </AtTabs>
			</View>
		)
	}
}

export default Order
