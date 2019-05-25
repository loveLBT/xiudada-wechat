import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'

import * as images from '../../util/requireImages'
import api from '../../service/api'
import './index.scss'

class ServiceTypeDetail extends Component {
	config = {
    navigationBarTitleText: '服务类别详情'
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
		api.post('/homePageSet/getServiceTypeDetail',{objectId: routerParams.id})
			.then((res) => {
				if(res.code === 200){
					Taro.hideLoading()
					this.setState({
						data: res.data
					})
				}
			})
	}
	handleServiceClick (id) {
		Taro.navigateTo({
      url: `/pages/index/serviceProjectDetail?id=${id}`
    })
	}
	render() {
		const { data } = this.state
		if(data) {
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
					{data.services.length > 0 && data.services.map((item, index) => {
						let imgStrStartIndex = item.logo.indexOf('-') + 1
			      let imgStrEndIndex = item.logo.indexOf('.')
			      let imgStrNumberIndex = item.logo.substring(imgStrStartIndex, imgStrEndIndex)
						return (
							<View onClick={this.handleServiceClick.bind(this, item.id)} className='service-info bb-line' key={index}>
								<Image className='img' src={images['server_'+imgStrNumberIndex]} />
								<View className='info'>
									<View className='txt-row'>
										<Text className='label'>服务名称：</Text>
										<Text className='value'>{item.name}</Text>
									</View>
									<View className='txt-row'>
										<Text className='label'>服务价格：</Text>
										<Text className='value'>￥{item.offerPrice}</Text>
									</View>
								</View>
							</View>
						)
					}) 
				}
				{data.services.length === 0 && 
					<View className='no-result'>
						<Image className='img' src={images.noResult} />
					</View>
				}
				</View>
			)
		}
	}
}

export default ServiceTypeDetail