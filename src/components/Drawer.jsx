import React from 'react'
import { ListItem, Icon, Image } from 'react-native-elements'
import { View, /* ImageBackground, */ ScrollView } from 'react-native'
import { useSelector } from 'react-redux'
import TranslationOnOffSwitcher from './TranslationShowSwitcher'
import content from '../utils/content'
import styles from '../styles'

export default function MyDrawer(props) {
	const { chapters, navigation } = props
	const { showTranslation } = useSelector(state => state.translation)
	const {
		layout: { drawer: layoutStyles }
	} = styles || {} // layout styles

	const chaptersTr = content.getTableOfContentTr()

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
					<View
						style={{
							flexDirection: 'row',
							padding: 10
						}}
					>
						<ListItem
							{...layoutStyles.listItemProps}
							style={{ width: '49%' }}
							onPress={() => navigation.navigate('Home')}
						>
							<ListItem.Content
								style={{
									marginBottom: 10,
									alignItems: 'center'
								}}
							>
								<Icon name='home' color={styles.general.colors.primary} />
								<ListItem.Title>Home</ListItem.Title>
							</ListItem.Content>
						</ListItem>
						<ListItem
							{...layoutStyles.listItemProps}
							style={{ width: '49%' }}
							onPress={() => navigation.navigate('About')}
						>
							<ListItem.Content
								style={{
									marginBottom: 10,
									alignItems: 'center'
								}}
							>
								<Icon name='info' color={styles.general.colors.primary} />
								<ListItem.Title>About</ListItem.Title>
							</ListItem.Content>
						</ListItem>
					</View>
					{chapters.map((elem, chapterIndex) => {
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
											{chaptersTr?.[chapterIndex]?.title}
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
