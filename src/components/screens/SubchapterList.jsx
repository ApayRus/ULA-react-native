import React from 'react'
import { ScrollView, View } from 'react-native'
import { Button } from 'react-native-elements'
import ChapterHeader from '../ChapterHeader'

const ChapterScreen = props => {
	const {
		route: {
			params: { title, subchapters }
		},
		navigation
	} = props

	const chapterHeaderProps = {
		navigation,
		title
	}

	return (
		<View>
			<ChapterHeader {...chapterHeaderProps} />
			<ScrollView contentContainerStyle={styles.chapterContainer}>
				<View>
					{subchapters.map(elem => {
						const { id, title, type } = elem
						const name = `subchapter-${id}`
						return (
							<Button
								containerStyle={styles.subchapterButton}
								key={name}
								title={`${id}-${title} [${type}]`}
								onPress={() => navigation.navigate(name)}
							/>
						)
					})}
				</View>
			</ScrollView>
		</View>
	)
}

const styles = {
	chapterContainer: {
		justifyContent: 'center',
		padding: 5
	},
	subchapterButton: {
		flex: 1,
		margin: 20
	}
}

export default ChapterScreen
