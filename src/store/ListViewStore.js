import Taro, { Component } from '@tarojs/taro'
import { observable, action, computed, runInAction } from 'mobx'

import refreshState from '../constants/refreshState'
import api from '../service/api'

const PAGE = 1
const SIZE = 10

class CodeBtnStore {
	@observable isHeaderRefreshing = false  // 头部是否正在刷新
    @observable isFooterRefreshing = false  // 尾部是否正在刷新
    @observable footerState = refreshState.Idle // 尾部当前的状态，默认为Idle，不显示控件
	@observable data = []
	@observable page = PAGE
	@observable size = SIZE
	@observable params = {}

	constructor(config) {
		this.getUrl = config.getUrl || ''
		this.setParams(config.params || {})
	}

	@computed get onLoadDataParams () {
		const params = Object.assign({},{
			pageSize: this.size,
			pageIndex: this.page,
		},this.params)
		return params
	}
	@action setParams = (data) => {
		this.params = Object.assign({}, data)
	}
	// 开始下拉刷新
	@action beginHeaderRefresh = () => {
		if(this.shouldStartHeaderRefreshing()){
			this.startHeaderRefreshing()
		}
	}
	// 开始上拉加载更多
	@action beginFooterRefresh = () => {
		if(this.shouldStartFooterRefreshing()){
			this.startFooterRefreshing()
		}
	}
	@action startHeaderRefreshing =	() => {
		this.isHeaderRefreshing = true
		this.page = PAGE
		this.data = []
		this.footerState = refreshState.Idle

		this.onLoadData()
	}
	@action startFooterRefreshing = () => {
		this.footerState = refreshState.Refreshing
		this.isFooterRefreshing = true

		this.onLoadData()
	}
	/***
     * 当前是否可以进行下拉刷新
     * @returns {boolean}
     *
     * 如果列表尾部正在执行上拉加载，就返回false
     * 如果列表头部已经在刷新中了，就返回false
     */
	@action shouldStartHeaderRefreshing = () => {
		if(this.footerState === refreshState.Refreshing || 
			this.isHeaderRefreshing ||
			this.isFooterRefreshing
		){
			return false
		}

		return true
	}
	/***
     * 当前是否可以进行上拉加载更多
     * @returns {boolean}
     *
     * 如果底部已经在刷新，返回false
     * 如果底部状态是没有更多数据了，返回false
     * 如果头部在刷新，则返回false
     * 如果列表数据为空，则返回false（初始状态下列表是空的，这时候肯定不需要上拉加载更多，而应该执行下拉刷新）
     */
	@action shouldStartFooterRefreshing = () => {
		if(this.footerState === refreshState.Refreshing ||
			this.footerState === refreshState.NoMoreData || 
			this.data.length === 0 ||
			this.isHeaderRefreshing ||
			this.isFooterRefreshing
		){
			return false
		}

		return true
	}
	/**
     * 根据尾部组件状态来停止刷新
     * @param footerState
     *
     * 如果刷新完成，当前列表数据源是空的，就不显示尾部组件了。
     * 这里这样做是因为通常列表无数据时，我们会显示一个空白页，如果再显示尾部组件如"没有更多数据了"就显得很多余
     */
	@action endRefreshing = (footerState) => {
		let footerRefreshState = footerState
		if(this.data.length === 0 && footerState === refreshState.NoMoreData) {
			footerRefreshState = refreshState.NulllData
		}
		this.footerState = footerRefreshState
		this.isHeaderRefreshing = false
		this.isFooterRefreshing = false
	}
	@action onLoadData = () => {
		const params = this.onLoadDataParams
		api.get(this.getUrl,params)
			.then((res) => {
				if(res.code === 200) {
					let data = res.data.list
					let total = res.data.total
					let currentCount = this.data.length
					let footerState = refreshState.Idle
					let page = this.page
					//根据已经加载的条数和总条数的比较，判断是否还有下一页
					if(currentCount + data.length < total) {
						//还有数据可加载
						footerState = refreshState.CanLoadMore
						page = page + 1
					}else {
						footerState = refreshState.NoMoreData
					}

					runInAction(() => {
						if(params.page !== PAGE) {
							this.data = [...this.data, ...data]
						}else {
							this.data = [...data]
						}

						this.page = page
					})

					this.endRefreshing(footerState)
				}else {
					this.endRefreshing(refreshState.Failure)
					this.data = []
				}

				Taro.stopPullDownRefresh()
			})
			.catch((err) => {
				this.endRefreshing(refreshState.Failure)
				this.data = []
				Taro.stopPullDownRefresh()
			})
	}
}

export default CodeBtnStore