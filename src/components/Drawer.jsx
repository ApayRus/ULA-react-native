import React from 'react'
import { ListItem, Icon, Image } from 'react-native-elements'
import { View, /* ImageBackground, */ ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import TranslationOnOffSwitcher from './TranslationShowSwitcher'
import content from '../utils/content'
import styles from '../utils/styles'

export default function MyDrawer(props) {
	const { chapters, navigation } = props
	const { showTranslation } = useSelector(state => state.translation)
	const {
		layout: { drawer: layoutStyles }
	} = styles || {} // layout styles

	const trChapters = content.getChapterTitlesTr()

	const isTitleDecorLeft = Boolean(
		content.getFilesByPathString('images/titleDecorLeft')?.file
	)
	const isTitleDecorRight = Boolean(
		content.getFilesByPathString('images/titleDecorRight')?.file
	)

	return (
		<View style={layoutStyles.containerView}>
			{/* <ImageBackground {...layoutStyles.backgroundImageProps}> */}
			<ScrollView style={layoutStyles.containerScrollView}>
				<View style={layoutStyles.imageContainer}>
					<Image {...layoutStyles.logoImageProps}></Image>
				</View>
				<View>
					<ListItem
						{...layoutStyles.listItemProps}
						onPress={() => navigation.navigate('Home')}
					>
						<Icon name='home' color='grey' />
						<ListItem.Content>
							<ListItem.Title>Home</ListItem.Title>
						</ListItem.Content>
					</ListItem>
					<ListItem
						{...layoutStyles.listItemProps}
						onPress={() => navigation.navigate('About')}
					>
						<Icon name='info' color='grey' />
						<ListItem.Content>
							<ListItem.Title>About</ListItem.Title>
						</ListItem.Content>
					</ListItem>
					{chapters.map(elem => {
						const { id, title } = elem
						const name = `chapter-${id}`
						return (
							<ListItem
								{...layoutStyles.listItemProps}
								key={name}
								onPress={() => navigation.navigate(name)}
							>
								{isTitleDecorLeft && (
									<Image {...layoutStyles.listItemDecorBeforeImageProps} />
								)}
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
								{isTitleDecorRight && (
									<Image {...layoutStyles.listItemDecorAfterImageProps} />
								)}
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
