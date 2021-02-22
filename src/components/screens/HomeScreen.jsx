import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { View, Image } from 'react-native'
import { Text, Button } from 'react-native-elements'
import TranslationsSelect from '../TranslationsSelect'
import content from '../../utils/content'
import layoutStylesModule from '../../config/styles/layout'

export default function HomeScreen({ navigation, route }) {
	const {
		params: { info, translations }
	} = route
	const { title, author } = info || {}

	const { homeScreen: layoutStyles } = layoutStylesModule

	return (
		<>
			<StatusBar style='auto' />
			<View style={layoutStyles.container}>
				<Text style={layoutStyles.title}>{title}</Text>
				<Text style={layoutStyles.author}>{author}</Text>
				<View style={layoutStyles.imageContainer}>
					<Image
						style={layoutStyles.image}
						source={content.getFilesByPathString('images/logo')?.file}
					></Image>
				</View>
				<Button
					onPress={() => navigation.toggleDrawer()}
					icon={layoutStyles.tableOfContentButtonIcon}
					buttonStyle={layoutStyles.tableOfContentButton}
					title='Table of contents'
				/>
				<View style={layoutStyles.additionalInfoContainer}>
					{Object.keys(info)
						.filter(key => key !== 'title' && key !== 'author')
						.map(key => (
							<View style={layoutStyles.additionalInfoItem} key={`info-${key}`}>
								<Text style={layoutStyles.additionalInfoText}>
									{key}: {info[key]}
								</Text>
							</View>
						))}
				</View>

				{translations.length > 0 && (
					<View style={layoutStyles.translationsContainer}>
						<TranslationsSelect translations={translations} />
					</View>
				)}
				<View style={layoutStyles.navigateForwardButtonContainer}>
					<Button
						{...layoutStyles.navigateForwardButtonType}
						icon={layoutStyles.navigateForwardButtonIcon}
						onPress={() => navigation.navigate('chapter-001')}
					/>
				</View>
			</View>
		</>
	)
}
