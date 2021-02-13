import React, { useState } from 'react'
import { View, TouchableOpacity, useWindowDimensions } from 'react-native'
import { Text, CheckBox } from 'react-native-elements'
import HTML, {
	defaultHTMLElementModels,
	useTNodeChildrenProps,
	TChildrenRenderer
} from 'react-native-render-html'
import { playAudio } from '../../utils/playerShortAudios'
import globalStyles from '../../config/globalStyles'

function InText(props) {
	const {
		subchapterDoc,
		subchapterTrDoc,
		chapterId,
		subchapterId,
		showTranslation,
		contentTypeDoc,
		trLang
	} = props

	const {
		title,
		content: { html, quizKeys: correctAnswers }
	} = subchapterDoc

	const [userAnswers, setUserAnswers] = useState([
		...correctAnswers.map(() => [])
	]) //2d array [[]], userAnswers[quizId][variantId]
	const contentWidth = useWindowDimensions().width

	const handlePress = (text, path) => () => {
		const fileName = path || text
		playAudio(fileName, 'intext')
	}

	const handlePressQuizVariant = (quizId, variantId, type) => () => {
		let quizAnswers = userAnswers[quizId] || []
		//if this answer also been set, we remove it
		// if there was clear cell -- we add it
		if (quizAnswers.includes(variantId)) {
			quizAnswers = quizAnswers.filter(elem => elem !== variantId)
		} else {
			if (type === 'multiple') {
				quizAnswers.push(variantId)
			} else {
				quizAnswers = [variantId]
			}
		}

		setUserAnswers(userAnswers => {
			const newUserAnswers = [...userAnswers]
			newUserAnswers[quizId] = quizAnswers
			return newUserAnswers
		})
	}

	// ====== RENDERERS ======

	const inTextRenderer = props => {
		const { tnode, TDefaultRenderer, key, ...defaultRendererProps } = props
		const {
			attributes: { text, path }
		} = tnode
		return (
			<TouchableOpacity onPress={handlePress(text, path)} key={key}>
				<Text style={[globalStyles.body2, { color: 'darkblue' }]}>{text}</Text>
			</TouchableOpacity>
		)
	}
	inTextRenderer.model = defaultHTMLElementModels.div

	// ====== QUIZ ==========

	const quizRenderer = props => {
		const { tnode, TDefaultRenderer, key, ...defaultRendererProps } = props
		const {
			attributes: { type, quizid: quizId }
		} = tnode
		const tchildrenProps = useTNodeChildrenProps(props)
		return (
			<TDefaultRenderer tnode={tnode} {...defaultRendererProps}>
				<TChildrenRenderer {...tchildrenProps} />
			</TDefaultRenderer>
		)
	}
	quizRenderer.model = defaultHTMLElementModels.div

	// =========== VARIANT =============

	const variantRenderer = props => {
		const { tnode, TDefaultRenderer, key, ...defaultRendererProps } = props
		const {
			attributes: { quizid: quizId, variantid: variantId, type }
		} = tnode
		const tchildrenProps = useTNodeChildrenProps(props)

		return (
			<TouchableOpacity
				key={key}
				onPress={handlePressQuizVariant(quizId, variantId, type)}
			>
				<Text style={{ borderWidth: 1, zIndex: 1 }}>
					<CheckBox
						size={18}
						{...(type === 'single'
							? { checkedIcon: 'dot-circle-o', uncheckedIcon: 'circle-o' }
							: {})}
						checked={userAnswers[quizId].includes(variantId)}
						containerStyle={{ margin: 0, padding: 0 }}
						onPress={handlePressQuizVariant(quizId, variantId, type)}
					/>
					<Text>
						<TDefaultRenderer tnode={tnode} {...defaultRendererProps}>
							<TChildrenRenderer {...tchildrenProps} />
						</TDefaultRenderer>
					</Text>
				</Text>
			</TouchableOpacity>
		)
	}
	variantRenderer.model = defaultHTMLElementModels.p

	return (
		<View style={{ padding: 5 }}>
			<HTML
				renderers={{
					quiz: quizRenderer,
					variant: variantRenderer
				}}
				source={{ html }}
				contentWidth={contentWidth}
			/>
		</View>
	)
}

export default InText
