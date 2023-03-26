/**
 * APP register Yod Pro
 */

import 'react-native-gesture-handler';

/* Importações React */
import { AppRegistry } from 'react-native';
import { name as App } from './app.json';

/* Importações Locais */
import Routes from './source/Router/Routes';

AppRegistry.registerComponent(App, () => Routes);