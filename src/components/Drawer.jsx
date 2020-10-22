import React from 'react'
import { Image, ListItem, Icon } from 'react-native-elements'
import { View, ScrollView } from 'react-native'
import TranslationOnOffSwitcher from './TranslationShowSwitcher'
import { useSelector } from 'react-redux'

export default function Drawer(props) {
	const { chapters, trChapters, navigation, globalStyles } = props
	const { showTranslation } = useSelector(state => state.translation)

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
