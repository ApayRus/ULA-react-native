import React from 'react'
import { ListItem, Icon, Image } from 'react-native-elements'
import { View, /* ImageBackground, */ ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import TranslationOnOffSwitcher from './TranslationShowSwitcher'
import content from '../utils/content'

import layoutStylesModule from '../config/styles/layout'

export default function Drawer(props) {
	const { chapters, navigation } = props
	const { showTranslation } = useSelector(state => state.translation)
	const { drawer: layoutStyles } = layoutStylesModule

	const trChapters = content.getChapterTitlesTr()

	return (
		<View style={layoutStyles.containerView}>
			{/* <ImageBackground {...layoutStyles.backgroundImageProps}> */}
			<ScrollView style={layoutStyles.containerScrollView}>
				<View style={layoutStyles.imageContainer}>
					<Image
						style={layoutStyles.image}
						source={content.getFilesByPathString('images/logo')?.file}
					></Image>
				</View>
				<View>
					<ListItem
						style={{ marginBottom: 5 }}
						// topDivider
						bottomDivider
						containerStyle={layoutStyles.listItem}
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
						containerStyle={layoutStyles.listItem}
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
						containerStyle={layoutStyles.listItem}
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
						containerStyle={layoutStyles.listItem}
						onPress={() => navigation.navigate('Typography')}
					>
						<Icon name='text-fields' color='grey' />
						<ListItem.Content>
							<ListItem.Title>Typography</ListItem.Title>
						</ListItem.Content>
					</ListItem>
					{chapters.map(elem => {
						const { id, title } = elem
						const name = `chapter-${id}`
						return (
							<ListItem
								bottomDivider
								containerStyle={layoutStyles.listItem}
								key={name}
								onPress={() => navigation.navigate(name)}
							>
								<ListItem.Content>
									<ListItem.Title style={layoutStyles.listItemText}>
										{title}
									</ListItem.Title>
									{showTranslation && (
										<ListItem.Subtitle style={layoutStyles.listItemTranslation}>
											{trChapters?.[id]?.title}
										</ListItem.Subtitle>
									)}
								</ListItem.Content>
							</ListItem>
						)
					})}
				</View>
			</ScrollView>
			<TranslationOnOffSwitcher />
			{/* </ImageBackground> */}
		</View>
	)
}
