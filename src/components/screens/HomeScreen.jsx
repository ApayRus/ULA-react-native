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
		<View style={layoutStyles.root}>
			<StatusBar style='light' />

			<ImageBackground {...layoutStyles.backgroundImageProps}>
				{/* before logo container  */}
				<View style={layoutStyles.beforeLogoContainer}>
					{title.split(/\\n/).map(titlePart => {
						return (
							<Text key={titlePart} style={layoutStyles.title}>
								{titlePart}
							</Text>
						)
					})}

					<Text style={layoutStyles.author}>{author}</Text>
				</View>
				{/* logo container */}
				<View style={layoutStyles.logoContainer}>
					<Image {...layoutStyles.logoImageProps} />
				</View>
				{/* after logo container  */}
				<View style={layoutStyles.afterLogoContainer}>
					<Button
						onPress={() => navigation.toggleDrawer()}
						{...layoutStyles.tableOfContentButtonProps}
					/>
					{Object.keys(info)
						.filter(key => key !== 'title' && key !== 'author')
						.map(key => (
							<View style={layoutStyles.additionalInfoItem} key={`info-${key}`}>
								<Text style={layoutStyles.additionalInfoText}>
									{key}: {info[key]}
								</Text>
							</View>
						))}
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
				</View>
			</ImageBackground>
		</View>
	)
}
