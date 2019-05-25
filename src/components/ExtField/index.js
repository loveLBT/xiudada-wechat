import Taro, { Component, } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import ImageList from '../../components/ImageList'
import './index.scss'

class ExitField extends Component {
	render() {

		return (
			<Fragment>
				{this.props.exitFields && this.props.exitFields.map((item, index) => 
					<Fragment key={index}>
						{[1, 2, 3, 4, 5, 6, 8, 9, 12].indexOf(item.type) !== -1 && 
							<View className='row'>
								<Text className='label'>{item.tfName || item.name}</Text>
								<Text className='value'>{item.tfValue || item.tfvvalue || '-'}</Text>
							</View>
						}
						{[7].indexOf(item.type) !== -1 && 
							<View className='row'>
								<Text className='label'>{item.tfName || item.name}</Text>
								<Text className='value'>{item.tfValue || item.tfvvalue ? "是" : "否" || "-"}</Text>
							</View>
						}
						{[10].indexOf(item.type) !== -1 && 
							<Fragment>
								<View className='row'>
									<Text className='label'>{item.tfName || item.name}</Text>
									<Text className='value'>
										{item.tfValue || item.tfvvalue ? "" : "-"}
									</Text>
								</View>
								<ImageList data={item.tfValue ? (item.tfValue || item.tfvvalue).split(",") : []} />
							</Fragment>
						}
					</Fragment>
				)}
			</Fragment>
		)
	}
}

export default ExitField