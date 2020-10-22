import React from 'react'
import { View, Linking } from 'react-native'
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
			<View style={{ padding: 10 }}>
				<Text h1 h1Style={{ marginLeft: 10, marginTop: 10 }}>
					About
				</Text>
				<Text>{'\n'}</Text>
				<Text h2 h2Style={{ marginLeft: 10, fontSize: 22 }}>
					Ulla
				</Text>
				<Text>{'\n'}</Text>
				<Text>
					Это приложение сделано на базе шаблона ULLA (Universal Language
					Learning App). Вы тоже можете создать подобное приложение, заполнив
					определенным образом:
				</Text>
				<Text>{'\n'}</Text>
				<Text style={{ marginLeft: 10 }}>- текст вашего учебника</Text>
				<Text style={{ marginLeft: 10 }}>- картинки</Text>
				<Text style={{ marginLeft: 10 }}>- аудио</Text>
				<Text>{'\n'}</Text>
				<Text>
					Создание языкового приложения ещё никогда не было таким простым.
				</Text>
				<Text>{'\n'}</Text>
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
				<Text>{'\n'}</Text>
				<Text h2 h2Style={{ marginLeft: 10, fontSize: 22 }}>
					Этот учебник
				</Text>
				<Text>{'\n'}</Text>
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
			</View>
		</>
	)
}

export default AboutScreen
