import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { observer } from '@tarojs/mobx'

import * as images from '../../util/requireImages'
import refreshState from '../../constants/refreshState'
import './index.scss'

@observer
class ListViewFooter extends Component {
	render() {
		const { state } = this.props

		switch (state) {
			case refreshState.Idle: {
				return (
					<View></View>
				)
				break
			}
			case refreshState.Refreshing: {
				return (
					<View className="footer-view">
						<AtIcon value='loading' size='22' color='#999'></AtIcon>
						<Text className="loading-txt">{this.props.footerRefreshingText}</Text>
					</View>
				)
				break
			}
			case refreshState.CanLoadMore: {
				return (
					<View className="footer-view">
						<Text className="txt">{this.props.footerLoadMoreText}</Text>
					</View>
				)
				break
			}
			case refreshState.NoMoreData: {
				return (
					<View className="footer-view">
						<Text className="txt">{this.props.footerNoMoreDataText}</Text>
					</View>
				)
				break
			}
			case refreshState.NulllData: {
				return (
					<View className="footer-view">
						<Image className='img' src={images.noResult} />
					</View>
				)
				break
			}
			case refreshState.Failure: {
				return (
					<View className="footer-view">
						<Text className='txt'>{this.props.footerFailureText}</Text>
					</View>
				)
				break
			}
		}
	}
}

ListViewFooter.defaultProps = {
	footerRefreshingText: "努力加载中",
  footerLoadMoreText: "上拉加载更多",
  footerFailureText: "数据加载出错",
  footerNoMoreDataText: "已全部加载完毕",
  footerNullDataText: "数据空空如也"
}

export default ListViewFooter