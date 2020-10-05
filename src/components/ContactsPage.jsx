import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Header } from 'react-native-elements'

export default function ContactsScreen({ navigation }) {
	return (
		<View>
			<Header
				rightComponent={{
					icon: 'menu',
					color: '#fff',
					onPress: () => navigation.toggleDrawer()
				}}
				centerComponent={{ text: 'Contacts', style: { color: '#fff' } }}
			/>
			<Text>Contacts</Text>
			<StatusBar style='auto' />
		</View>
	)
}
