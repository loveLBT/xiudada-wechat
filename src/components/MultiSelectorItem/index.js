import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import { AtIcon, AtModal, AtModalAction, AtCheckbox } from 'taro-ui'

import './index.scss'

class Account extends Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
	  	isOpened: false,
      opts:this.props.value || [],
      vals: []
	  }
	}
  componentDidMount () {
    this.setVals(this.props.value)
  }
	handleOpenModal () {
		this.setState({
			isOpened: true
		})
	}
  handleCloseModal () {
    this.setState({
      isOpened: false
    })
  }
  setVals (values) {
    let vals = []
    for(let item of this.props.data) {
      for(let value of values) {
        if(value === item.value) {
          vals.push(item.label)
        }
      }
    }
    this.setState({
      vals
    })
  }
  handleConfirm () {
    const { opts } = this.state
    this.props.onChange({
      detail:{
        value: opts
      }
    })
    this.setVals(opts)
    this.handleCloseModal()
  }
  handleChange (values) {
   this.setState({
    opts: values
   })
  }
	render() {
		return (
			<View className='mutil-select-item'>
				<View onClick={this.handleOpenModal.bind(this)} className='item'>
					<View className='left'>
        		{this.props.required && 
        			<Text className='required'>*</Text>
        		}
        		<Text className='title'>{this.props.title}</Text>
        	</View>
        	{this.state.vals.length > 0 ? 
        		<Text className='value'>{this.state.vals.join(',')}</Text> :
        		<Text className='value'>{this.props.placeholder || `请选择${this.props.title}`}</Text>
        	}
        	<AtIcon value='chevron-right' size='22' color='#999'></AtIcon>
				</View>
        {this.state.isOpened && 
          <AtModal 
            isOpened={true}
            confirmText='确认'
            cancelText='取消'
          >
            <View className='modal-content'>
              <AtCheckbox
                options={this.props.data}
                selectedList={this.state.opts}
                onChange={this.handleChange.bind(this)}
              />
            </View>
            <AtModalAction> 
              <Button onClick={this.handleCloseModal.bind(this)}>取消</Button> 
              <Button onClick={this.handleConfirm.bind(this)}>确定</Button> 
            </AtModalAction>
          </AtModal>
        }
			</View>
		)
	}
}

export default Account