import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { View, ImageBackground, Image } from 'react-native'
import { Text, Button } from 'react-native-elements'
import TranslationsSelect from '../TranslationsSelect'
import { useSelector } from 'react-redux'
import content from '../../utils/content'
import styles from '../../utils/styles'

export default function HomeScreen({ navigation }) {
	const info = content.getInfo()
	const { trLang } = useSelector(state => state.translation)
	const infoTr = content.getInfoTr(trLang)
	const translations = content.getTranslations()

	const { title, paramsArray } = info || {}
	const { title: titleTr, paramsArray: paramsArrayTr } = infoTr || {}

	const {
		layout: { homeScreen: layoutStyles }
	} = styles || {} // layout styles

	// for multiline titles
	const titleSplit = title.split(/\\n/)
	const titleSplitTr = titleTr?.split(/\\n/)

	return (
		<View style={layoutStyles.root}>
			<StatusBar style='light' />

			<ImageBackground {...layoutStyles.backgroundImageProps}>
				{/* before logo container  */}
				<View style={layoutStyles.beforeLogoContainer}>
					{titleSplit.map((titlePart, index) => {
						const titlePartTr = titleSplitTr?.[index]
						return (
							<View
								key={`titlePart-${index}`}
								style={layoutStyles.titleContainer}
							>
								<Text style={layoutStyles.titleText}>{titlePart}</Text>
								{titlePartTr ? (
									<Text style={layoutStyles.translationText}>
										{titlePartTr}
									</Text>
								) : null}
							</View>
						)
					})}

					{paramsArray[0].map((param, index) => {
						const paramTr = paramsArrayTr?.[0]?.[index]

						return (
							<View
								style={layoutStyles.additionalInfoItem}
								key={`info-${param}`}
							>
								<Text style={layoutStyles.additionalInfoText}>{param}</Text>
								<Text style={layoutStyles.translationText}>{paramTr}</Text>
							</View>
						)
					})}
				</View>
				{/* logo container */}
				<View style={layoutStyles.logoContainer}>
					<Image {...layoutStyles.logoImageProps} />
					{paramsArray[1].map((param, index) => {
						const paramTr = paramsArrayTr?.[1]?.[index]
						return (
							<View
								style={layoutStyles.additionalInfoItem}
								key={`info-${param}`}
							>
								<Text style={layoutStyles.additionalInfoText}>{param}</Text>
								<Text style={layoutStyles.translationText}>{paramTr}</Text>
							</View>
						)
					})}
				</View>
				{/* after logo container  */}
				<View style={layoutStyles.afterLogoContainer}>
					<Button
						onPress={() => navigation.toggleDrawer()}
						{...layoutStyles.tableOfContentButtonProps}
					/>
					{paramsArray[2].map((param, index) => {
						const paramTr = paramsArrayTr?.[2]?.[index]
						return (
							<View
								style={layoutStyles.additionalInfoItem}
								key={`info-${param}`}
							>
								<Text style={layoutStyles.additionalInfoText}>{param}</Text>
								<Text style={layoutStyles.translationText}>{paramTr}</Text>
							</View>
						)
					})}
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
