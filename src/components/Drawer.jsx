import React from 'react'
import { Image, ListItem } from 'react-native-elements'
import { View, StyleSheet, ScrollView } from 'react-native'

export default function Drawer(props) {
	const { chapters, navigation, globalStyles } = props

	return (
		<ScrollView style={globalStyles.writingDirection}>
			<View style={{ display: 'flex', marginTop: 10, alignItems: 'center' }}>
				<Image
					style={{ width: 100, height: 100 }}
					source={require('../assets/images/logo.png')}
				></Image>
			</View>
			<View>
				{chapters.map(elem => (
					<ListItem
						bottomDivider
						containerStyle={styles.listItem}
						key={`lesson-${elem.id}`}
						onPress={() => navigation.navigate(elem.title)}
					>
						<ListItem.Content>
							<ListItem.Title style={globalStyles.body2}>
								{elem.title}
							</ListItem.Title>
							<ListItem.Subtitle>translation</ListItem.Subtitle>
						</ListItem.Content>
					</ListItem>
				))}
			</View>
		</ScrollView>
	)
}

const styles = {
	listItem: {
		paddingBottom: 2,
		paddingTop: 2
	}
}
