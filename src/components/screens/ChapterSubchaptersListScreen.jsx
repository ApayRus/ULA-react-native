import React from 'react'
import { ScrollView, View } from 'react-native'
import { Button } from 'react-native-elements'
import ChapterHeader from '../ChapterHeader'
import styles from '../../styles'

const ChapterSubchaptersListScreen = props => {
	const {
		route: {
			params: { chapterId, subchapters }
		},
		navigation
	} = props

	const chapterHeaderProps = {
		navigation,
		chapterId
	}
	const {
		layout: { subchaptersListScreen: layoutStyles }
	} = styles || {} // layout styles

	return (
		<View>
			<ChapterHeader {...chapterHeaderProps} />
			<ScrollView contentContainerStyle={layoutStyles.screenContainer}>
				<View style={layoutStyles.listContainer}>
					{subchapters.map(elem => {
						const { id, title /* type */ } = elem
						// use type for display icon
						const name = `subchapter-${id}`
						return (
							<Button
								containerStyle={layoutStyles.subchapterButton}
								key={name}
								// title={`${id}-${title} [${type}]`}
								title={title}
								onPress={() => navigation.navigate(name)}
							/>
						)
					})}
				</View>
			</ScrollView>
		</View>
	)
}

export default ChapterSubchaptersListScreen
