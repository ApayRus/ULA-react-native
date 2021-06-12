import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { View, ImageBackground, Image } from 'react-native'
import { Text, Button } from 'react-native-elements'
import TranslationsSelect from '../TranslationsSelect'
import { useSelector } from 'react-redux'
import content from '../../utils/content'
import styles from '../../styles'

export default function HomeScreen({ navigation }) {
	const { trLang } = useSelector(state => state.translation)
	const info = content.getInfo()
	const infoTr = content.getInfo(trLang)
	const translations = content.getTranslationLangs()

	const { title, paramsArray } = info || {}
	const { title: titleTr, paramsArray: paramsArrayTr } = infoTr || {}

	const {
		layout: { homeScreen: layoutStyles }
	} = styles || {} // layout styles

	// for multiline titles
	const titleSplit = title.split(/\\n/)
	const titleSplitTr = titleTr?.split(/\\n/)

	const titleBlock = titleSplit.map((titlePart, index) => {
		const titlePartTr = titleSplitTr?.[index]
		return (
			<View key={`titlePart-${index}`} style={layoutStyles.titleContainer}>
				<Text style={layoutStyles.titleText}>{titlePart}</Text>
				{titlePartTr ? (
					<Text style={layoutStyles.translationText}>{titlePartTr}</Text>
				) : null}
			</View>
		)
	})

	const additionalInfoBlocks = paramsArray?.map((array, index1) =>
		array?.map((param, index2) => {
			const paramTr = paramsArrayTr?.[index1]?.[index2]

			return (
				<View
					style={layoutStyles.additionalInfoItem}
					key={`info-${index1}-${index2}`}
				>
					<Text style={layoutStyles.additionalInfoText}>{param}</Text>
					<Text style={layoutStyles.translationText}>{paramTr}</Text>
				</View>
			)
		})
	)

	return (
		<View style={layoutStyles.root}>
			<StatusBar style='light' />
			<ImageBackground {...layoutStyles.backgroundImageProps}>
				{/* before logo container  */}
				<View style={layoutStyles.beforeLogoContainer}>
					{titleBlock}
					{additionalInfoBlocks[0]}
				</View>
				{/* logo container */}
				<View style={layoutStyles.logoContainer}>
					<Image {...layoutStyles.logoImageProps} />
					{additionalInfoBlocks[1]}
				</View>
				{/* after logo container  */}
				<View style={layoutStyles.afterLogoContainer}>
					<Button
						onPress={() => navigation.toggleDrawer()}
						{...layoutStyles.tableOfContentButtonProps}
					/>
					{additionalInfoBlocks[2]}
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
