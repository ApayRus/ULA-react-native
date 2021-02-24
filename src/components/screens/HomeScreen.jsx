import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { View, ImageBackground } from 'react-native'
import { Text, Button, Image } from 'react-native-elements'
import TranslationsSelect from '../TranslationsSelect'
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
				<ImageBackground {...layoutStyles.backgroundImageProps}>
					<Text style={layoutStyles.title}>{title}</Text>
					<Text style={layoutStyles.author}>{author}</Text>
					<View style={layoutStyles.logoImageContainer}>
						<Image {...layoutStyles.logoImageProps} />
					</View>
					<Button
						onPress={() => navigation.toggleDrawer()}
						{...layoutStyles.tableOfContentButtonProps}
					/>
					<View style={layoutStyles.additionalInfoContainer}>
						{Object.keys(info)
							.filter(key => key !== 'title' && key !== 'author')
							.map(key => (
								<View
									style={layoutStyles.additionalInfoItem}
									key={`info-${key}`}
								>
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
							{...layoutStyles.navigateForwardButtonProps}
							onPress={() => navigation.navigate('chapter-001')}
						/>
					</View>
				</ImageBackground>
			</View>
		</>
	)
}
