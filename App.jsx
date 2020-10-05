import React from 'react'
import HomeScreen from './src/components/HomePage'
import ContactsScreen from './src/components/ContactsPage'
import LessonScreen from './src/components/LessonPage'
import { NavigationContainer } from '@react-navigation/native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import Icon from 'react-native-vector-icons/Ionicons'
import lessonsContent from './src/assets/lessons/lessonsContent'
import { map } from 'lodash'
const Drawer = createDrawerNavigator()

const lessons = map(lessonsContent, (elem, key) => ({
	id: key,
	title: elem.title
}))

export default function App() {
	return (
		<NavigationContainer>
			<Drawer.Navigator initialRouteName='Home'>
				<Drawer.Screen
					name='Home'
					component={HomeScreen}
					options={{
						headerLeft: () => <Icon.Button name='ios-menu' size={25} />
					}}
				/>
				<Drawer.Screen name='Contacts' component={ContactsScreen} />
				{lessons.map(elem => (
					<Drawer.Screen
						key={`lesson-${elem.id}`}
						name={elem.title}
						component={LessonScreen}
						initialParams={{
							lessonId: elem.id,
							lessonDoc: lessonsContent[elem.id]
						}}
					/>
				))}
			</Drawer.Navigator>
		</NavigationContainer>
	)
}
