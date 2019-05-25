import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image  } from '@tarojs/components'
import api from '../../service/api'

import * as images from '../../util/requireImages'
import './index.scss'

const logoIcon = require('../../assets/images/logo_icon.png')
const server = require('../../assets/images/service_icon/server-1.png')

class Index extends Component {
  config = {
    navigationBarTitleText: '首页',
    enablePullDownRefresh: true,
    backgroundTextStyle: 'dark'
  }
  constructor(props) {
    super(props)
  
    this.state = {
      banners:[],
      menu1: [],
      menu2: []
    }
  }
  componentDidMount () {
    Taro.startPullDownRefresh()
  }
  onPullDownRefresh () {
    this.getData()
  }
  getData () {
    Taro.showLoading({
      title: 'Loading...'
    })
    Promise.all([this.getBanners(), this.getMenu1(), this.getMenu2()])
      .then((res) => {
        Taro.hideLoading()
        Taro.stopPullDownRefresh()
      })
  }
  getBanners () {
    api.post('/homePageSet/getHomePageBanners')
        .then((res) => {
          if(res.code === 200){
            this.setState({
              banners: res.data
            })
          }
        })
  }
  getMenu1 = () => {
    api.get('/homePageSet/getRecommendServices')
      .then((res) => {
        if(res.code === 200){
          this.setState({
            menu1: res.data
          })
        }
      })
  }
  getMenu2 = () => {
    api.get('/homePageSet/getHomePageServiceTypes')
      .then((res) => {
        if(res.code === 200){
          this.setState({
            menu2: res.data
          })
        }
      })
  }
  handleMenu1Click (id) {
    Taro.navigateTo({
      url: `/pages/index/serviceProjectDetail?id=${id}`
    })
  }
  handleMenu2Click (id) {
    Taro.navigateTo({
      url: `/pages/index/serviceTypeDetail?id=${id}`
    })
  }
  render () {
    const { banners, menu1, menu2 } = this.state

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
            {banners.map((item,index) => 
              <SwiperItem key={index}>
                <Image className='img' src={item.img_url} />
              </SwiperItem>
            )}
          </Swiper>
        </View>
        {menu1.length > 0 && 
          <View className='menu'>
            <View className='title'>
              <View className='line'></View>
              <Text className='txt'>推荐服务</Text>
            </View>
            <View className='list'>
              {menu1.map((item, index) => {
                let imgStrStartIndex = item.logo.indexOf('-')+1
                let imgStrEndIndex = item.logo.indexOf('.')
                let imgStrNumberIndex = item.logo.substring(imgStrStartIndex, imgStrEndIndex)
                return (
                  <View onClick={this.handleMenu1Click.bind(this, item.id)} key={index} className='item'>
                    <Image className='img' src={images['server_'+imgStrNumberIndex]} />
                    <Text className='txt'>{item.name}</Text>
                  </View>
                )
              })}
            </View>
          </View>
        }
        {menu2.length > 0 && 
          <View className='menu'>
            <View className='title'>
              <View className='line'></View>
              <Text className='txt'>推荐类别</Text>
            </View>
            <View className='list'>
              {menu2.map((item, index) => {
                let imgStrStartIndex = item.logo.indexOf('-')+1
                let imgStrEndIndex = item.logo.indexOf('.')
                let imgStrNumberIndex = item.logo.substring(imgStrStartIndex, imgStrEndIndex)
                return (
                  <View onClick={this.handleMenu2Click.bind(this, item.id)} className='item' key={index}>
                    <Image className='img' src={images['server_'+imgStrNumberIndex]} />
                    <Text className='txt'>{item.name}</Text>
                  </View>
                )
              })}
            </View>
          </View>
        }
      </View>
    )
  }
}

export default Index 
