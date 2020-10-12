import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, View, Linking } from 'react-native'
import { Header, Image, Text, Button, colors } from 'react-native-elements'

export default function HomeScreen({navigation, route}) {
	const {params : {info,globalStyles} } = route
	const {title, author, description, website} = info || {}
	delete info.title
	delete info.author
	delete info.description
	delete info.website
	const infoArray = Object.entries(info)
	console.log('website', website)
	return (
		<>
			<StatusBar style='auto' />
			<Header
				backgroundColor='#fff'
				rightComponent={{
					icon: 'menu',
					// color: '#fff',
					onPress: () => navigation.toggleDrawer()
				}}
				centerComponent={{
					text: '',
					style: {
						/*  color: '#fff' */
					}
				}}
			/>
			<View style={styles.container}>
			<Text style={globalStyles.body1}>{title}</Text>
			<Text style={globalStyles.body3}>{author}</Text>
			<Text >{'\n'}</Text>
				<Image
					style={{ width: 200, height: 200 }}
					source={require('../../content/images/logo.png')}
				></Image>
			<Text >{'\n'}</Text>
			<Text >{description}</Text>
			<Text >{'\n'}</Text>
			{infoArray && infoArray.map((elem) => {
					const [key, value] = elem
					return <Text key={`info-${key}`} >{`${key}: ${value}`}</Text>
				}) }
			<Text >{'\n'}</Text>
			<Text >{'\n'}</Text>
			<Button  onPress={ ()=>navigation.toggleDrawer() }  
				icon={{
					name: "list",
					// size: 15,
					color: "white"
				}}
				title="Table of contents"
				/>
			<Text >{'\n'}</Text>
			<Button type="clear" onPress={()=>Linking.openURL(`https://${website}`)} 
				icon={{
					name: "language",
					size: 15,
					color: colors.primary
				}}
				title="website"
				/>
			</View>
		</>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center'
	}
})
