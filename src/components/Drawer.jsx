import React from 'react'
import { ListItem, Icon } from 'react-native-elements'
import { View, Image, ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import TranslationOnOffSwitcher from './TranslationShowSwitcher'
import content from '../utils/content'

export default function Drawer(props) {
	const { chapters, navigation, globalStyles } = props
	const { showTranslation, trLang } = useSelector(state => state.translation)

	const trChapters = content.getChapterTitlesTr(trLang)

	return (
		<View style={{ flex: 1 }}>
			<ScrollView style={globalStyles.writingDirection}>
				<View style={{ display: 'flex', marginTop: 10, alignItems: 'center' }}>
					<Image
						style={{ width: 100, height: 100 }}
						source={require('../../content/images/logo.png')}
					></Image>
				</View>
				<View>
					<ListItem
						style={{ marginBottom: 5 }}
						// topDivider
						bottomDivider
						containerStyle={styles.listItem}
						onPress={() => navigation.navigate('Home')}
					>
						<Icon name='home' color='grey' />
						<ListItem.Content>
							<ListItem.Title>Home</ListItem.Title>
						</ListItem.Content>
					</ListItem>
					<ListItem
						style={{ marginBottom: 5 }}
						// topDivider
						bottomDivider
						containerStyle={styles.listItem}
						onPress={() => navigation.navigate('About')}
					>
						<Icon name='info' color='grey' />
						<ListItem.Content>
							<ListItem.Title>About</ListItem.Title>
						</ListItem.Content>
					</ListItem>
					<ListItem
						style={{ marginBottom: 5 }}
						// topDivider
						bottomDivider
						containerStyle={styles.listItem}
						onPress={() => navigation.navigate('Exercise')}
					>
						<Icon name='info' color='grey' />
						<ListItem.Content>
							<ListItem.Title>Exercise</ListItem.Title>
						</ListItem.Content>
					</ListItem>
					<ListItem
						style={{ marginBottom: 5 }}
						// topDivider
						bottomDivider
						containerStyle={styles.listItem}
						onPress={() => navigation.navigate('Typography')}
					>
						<Icon name='text-fields' color='grey' />
						<ListItem.Content>
							<ListItem.Title>Typography</ListItem.Title>
						</ListItem.Content>
					</ListItem>
					{chapters.map(elem => (
						<ListItem
							bottomDivider
							containerStyle={styles.listItem}
							key={`lesson-${elem.id}`}
							onPress={() => navigation.navigate(elem.title)}
						>
							<ListItem.Content>
								<ListItem.Title style={globalStyles.body2}>
									{elem.title}
								</ListItem.Title>
								{showTranslation && (
									<ListItem.Subtitle>
										{trChapters[elem.id]?.title}
									</ListItem.Subtitle>
								)}
							</ListItem.Content>
						</ListItem>
					))}
				</View>
			</ScrollView>
			<TranslationOnOffSwitcher />
		</View>
	)
}

const styles = {
	listItem: {
		paddingBottom: 2,
		paddingTop: 2
	}
}
