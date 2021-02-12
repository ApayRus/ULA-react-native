import React from 'react'
import { ScrollView, View } from 'react-native'
import { Text, Button } from 'react-native-elements'
import TranslationOnOffSwitcher from '../TranslationShowSwitcher'
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
		<View style={styles.chapterContainer}>
			<View>
				<ScrollView>
					<ChapterHeader {...chapterHeaderProps} />
					{subchapters.map(elem => {
						const { id, title, type } = elem
						const name = `subchapter-${id}`
						return (
							<Button
								style={styles.subchapterButton}
								key={name}
								title={`${id}-${title} [${type}]`}
								onPress={() => navigation.navigate(name)}
							/>
						)
					})}
				</ScrollView>
			</View>
		</View>
	)
}

const styles = {
	chapterContainer: {
		flex: 1,
		justifyContent: 'center',
		padding: 5
	},
	subchapterButton: {
		flex: 1,
		marginBottom: 20
	}
}

export default ChapterScreen
