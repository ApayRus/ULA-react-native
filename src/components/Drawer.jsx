import React from 'react'
import { Image, ListItem } from 'react-native-elements'
import { View, StyleSheet } from 'react-native'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'

export default function Drawer(props) {
	const { lessons, navigation } = props

	return (
		<DrawerContentScrollView>
			<View style={{ display: 'flex', marginTop: 10, alignItems: 'center' }}>
				<Image
					style={{ width: 100, height: 100 }}
					source={require('../assets/images/logo.png')}
				></Image>
			</View>
			{lessons.map(elem => (
				<ListItem
					key={`lesson-${elem.id}`}
					onPress={() => navigation.navigate(elem.title)}
				>
					<ListItem.Content>
						<ListItem.Title style={styles.arabic}>{elem.title}</ListItem.Title>
						<ListItem.Subtitle>translation</ListItem.Subtitle>
					</ListItem.Content>
				</ListItem>
			))}
		</DrawerContentScrollView>
	)
}

const styles = StyleSheet.create({
	arabic: {
		fontFamily: 'Scheherazade_400Regular',
		fontSize: 20
	}
})
