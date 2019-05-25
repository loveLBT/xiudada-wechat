import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'

import * as images from '../../util/requireImages'
import api from '../../service/api'
import './index.scss'

class ServiceProjectDetail extends Component {
	config = {
    navigationBarTitleText: '服务项目详情'
  }
	constructor(props) {
	  super(props)
	
	  this.state = {
	  	data: null
	  }
	}
	componentDidMount () {
		this.getData()
	}
	getData () {
		const routerParams = this.$router.params

		Taro.showLoading({
			title: 'Loading...'
		})
		api.post('/homePageSet/getServiceDetail',{id: routerParams.id})
			.then((res) => {
				if(res.code === 200){
					Taro.hideLoading()
					this.setState({
						data: res.data
					})
				}
			})
	}
	handleAppoint () {
		const { data } = this.state
		Taro.navigateTo({
      url: `/pages/order/orderForm?serviceName=${data.name}&tempId=${data.tempId}&serviceId=${data.id}`
    })

	}
	render() {
		const { data } = this.state
		if(data) {
			let imgStrStartIndex = data.logo.indexOf('-')+1
      let imgStrEndIndex = data.logo.indexOf('.')
      let imgStrNumberIndex = data.logo.substring(imgStrStartIndex, imgStrEndIndex)

			return (
				<View className='page'>
					<View className='swiper'>
						<Swiper
	            className='test-h'
	            indicatorColor='#999'
	            indicatorActiveColor='#3ccba6'
	            circular
	            indicatorDots
	            autoplay
	          >
	            {data.banners.map((item,index) => 
	              <SwiperItem key={index}>
	                <Image className='img' src={item.img_url} />
	              </SwiperItem>
	            )}
	          </Swiper>
					</View>
					<View className='service-info'>
						<Image className='img' src={images[`server_${imgStrNumberIndex}`]} />
						<View className='info'>
							<View className='txt-row'>
								<Text className='label'>服务名称：</Text>
								<Text className='value'>{data.name}</Text>
							</View>
							<View className='txt-row'>
								<Text className='label'>服务价格：</Text>
								<Text className='value'>￥{data.offerPrice}</Text>
							</View>
						</View>
					</View>
					<Text className='service-desc'>
						{data.descri}
					</Text>
					<View className='service-appointment'>
						<AtButton onClick={this.handleAppoint.bind(this)} type='primary'>我要预约</AtButton>
					</View>
				</View>
			)
		}
	}
}

export default ServiceProjectDetail