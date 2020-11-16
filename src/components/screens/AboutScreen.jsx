import React from 'react'
import { View, ScrollView, Linking } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { Text, Button, colors, Header } from 'react-native-elements'

function AboutScreen({ navigation }) {
	const website = ''
	return (
		<>
			<StatusBar style='auto' />
			<Header
				rightComponent={{
					icon: 'menu',
					color: '#fff',
					onPress: () => navigation.toggleDrawer()
				}}
				leftComponent={{
					icon: 'home',
					color: '#fff',
					onPress: () => navigation.navigate('Home')
				}}
			/>
			<ScrollView style={{ padding: 10 }}>
				<Text h1 h1Style={{ marginLeft: 10, marginTop: 10 }}>
					About
				</Text>

				<Text h2 h2Style={{ marginLeft: 10, fontSize: 22 }}>
					Ulla
				</Text>

				<Text>
					Это приложение сделано на базе шаблона ULLA (Universal Language
					Learning App). Вы тоже можете создать подобное приложение, заполнив
					определенным образом:
				</Text>

				<Text style={{ marginLeft: 10 }}>- текст вашего учебника</Text>
				<Text style={{ marginLeft: 10 }}>- картинки</Text>
				<Text style={{ marginLeft: 10 }}>- аудио</Text>

				<Text>
					Создание языкового приложения ещё никогда не было таким простым.
				</Text>

				<Text>Более детально вы можете ознакомиться здесь:</Text>
				<Button
					type='clear'
					onPress={() => Linking.openURL(`https://${website}`)}
					icon={{
						name: 'language',
						size: 15,
						color: colors.primary
					}}
					title='ULLA - github page'
				/>

				<Text h2 h2Style={{ marginLeft: 10, fontSize: 22 }}>
					Этот учебник
				</Text>

				<Text>
					Данный конкретный учебник находится в открытом доступе. И вы можете
					внести вклад в его развитие, исправляя, дополняя, добавляя переводы и
					спонсируя его. Подробнее вы можете ознакомиться здесь:
				</Text>
				<Button
					type='clear'
					onPress={() => Linking.openURL(`https://${website}`)}
					icon={{
						name: 'language',
						size: 15,
						color: colors.primary
					}}
					title='Учебник на гитхабе'
				/>
			</ScrollView>
		</>
	)
}

export default AboutScreen
