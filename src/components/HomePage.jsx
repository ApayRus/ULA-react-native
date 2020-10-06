import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Header, Image } from 'react-native-elements'

export default function HomeScreen({ navigation }) {
	return (
		<>
			<StatusBar style='auto' />
			<Header
				rightComponent={{
					icon: 'menu',
					color: '#fff',
					onPress: () => navigation.toggleDrawer()
				}}
				centerComponent={{ text: 'Home', style: { color: '#fff' } }}
			/>
			<View style={styles.container}>
				<Image
					style={{ width: 200, height: 200 }}
					source={require('../assets/images/logo.png')}
				></Image>
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
