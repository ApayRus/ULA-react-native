import React from 'react'
import { registerRootComponent } from 'expo'

import App from './App'
import { Provider } from 'react-redux'
import store from './src/store/rootReducer'

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
const rootComponent = () => <Provider store={store}>
<App />
</Provider>
registerRootComponent(
	rootComponent
)
