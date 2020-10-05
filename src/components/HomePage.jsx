import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Header } from 'react-native-elements'

export default function HomeScreen({ navigation }) {
	return (
		<>
			<Header
				rightComponent={{
					icon: 'menu',
					color: '#fff',
					onPress: () => navigation.toggleDrawer()
				}}
				centerComponent={{ text: 'Home', style: { color: '#fff' } }}
			/>
			<View style={styles.container}>
				<Text>HomePage</Text>
				<StatusBar style='auto' />
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
