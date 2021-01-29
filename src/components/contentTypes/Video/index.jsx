import React, { useRef, useState, useEffect } from 'react'
import { View, Text, useWindowDimensions } from 'react-native'
import { Audio, Video } from 'expo-av'

const index = () => {
	const videoPlayer = useRef(null)
	const [uri, setUri] = useState()

	const { width: screenWidth, height: screenHeight } = useWindowDimensions()
	console.log('useWindowDimensions()', useWindowDimensions())

	useEffect(() => {
		fetch('https://direct-link.vercel.app/api/video/DuSa5E-GgwU')
			.then(response => {
				// console.log('response', response)
				return response.json()
			})
			.then(responseJson => {
				setUri(responseJson.urlVideo)
				console.log('url', uri)
			})
			.catch(error => {
				console.error(error)
			})
	}, [uri])

	// require('../../../../content/videos/videoplayback-1.mp4')

	return (
		<View>
			<Video
				resizeMode='stretch'
				useNativeControls
				style={{
					width: screenWidth,
					height: (screenWidth * 9) / 16
				}}
				source={require('../../../../content/audios/words/005-001.mp3')}
			/>
		</View>
	)
}

export default index
