/* Importações React */
import React, { useContext, useEffect } from 'react';
import type { Node } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from '@react-navigation/drawer';

/* Importações Plugins */
import { SvgXml } from 'react-native-svg';

/* Importações Locais */
import Menu from '../Component/Menu';
import Images from '../Service/Images';
import Styles from '../Service/Styles';

/* Rotas sem menu */
import Login from '../Pages/Onboarding/Login';

/* Rotas com menu */
import Dashboard from '../Pages/Dashboard/Dashboard';
import Chamados from '../Pages/Chamados/Chamados';
import ChamadoDetalhe from '../Pages/Chamados/ChamadoDetalhe';
import ChamadoForm from '../Pages/Chamados/ChamadoForm';
import RelatorioGeral from '../Pages/RelatorioGeral/RelatorioGeral';

/* Navigator sem menu */
const Stack = createNativeStackNavigator();

/* Navigator com menu */
const Drawer = createDrawerNavigator();

const Routes: () => Node = () => {

	return (
		<NavigationContainer>

			<Stack.Navigator screenOptions={{ headerStyle: { elevation: 0, shadowOpacity: 0, borderBottomWidth: 0 } }} initialRouteName="Login" screenOptions={{ headerShown: false }}>
				
				<Stack.Screen key="stack-0" name="Login" component={Login} options={{ gestureEnabled: false }} />

				<Stack.Screen key="stack-drawer" name="Drawer" component={DrawerRoutes} options={{ headerShown: false }} />
				
			</Stack.Navigator>

		</NavigationContainer>
	)
}

const DrawerRoutes: () => Node = () => {
    return (
        <Drawer.Navigator drawerContent={props => <Menu {...props} />} screenOptions={{ unmountOnBlur: true, drawerStyle: { backgroundColor: 'transparent' }, headerStyle: Styles.background_primary, headerTitleStyle: Styles.color_white, headerTintColor: '#FFFFFF' }} initialRouteName="Dashboard">
            
            <Drawer.Screen key="drawer-0" name="Dashboard" component={Dashboard} options={({ navigation, route}) => ({ headerShown: true, headerRight: () => (
                <TouchableOpacity onPress={() => { navigation.navigate('Chamado') }} style={{ marginHorizontal: 20 }}>
                    <SvgXml xml={Images.icons.add} width={20} />
                </TouchableOpacity>
            ) })} />
            <Drawer.Screen key="drawer-1" name="Chamados" component={Chamados} options={{ headerShown: true }} />
            <Drawer.Screen key="drawer-2" name="Detalhes" component={ChamadoDetalhe} options={({ navigation, route}) => ({ headerShown: true, headerLeft: () => (
            	<TouchableOpacity onPress={() => { navigation.goBack() }} style={{ marginHorizontal: 20 }}>
            		<SvgXml xml={Images.icons.right_arrow_white} width={10} />
            	</TouchableOpacity>
            ) })} />
            <Drawer.Screen key="drawer-3" name="Chamado" component={ChamadoForm} options={({ navigation, route}) => ({ headerShown: true, headerLeft: () => (
            	<TouchableOpacity onPress={() => { navigation.goBack() }} style={{ marginHorizontal: 20 }}>
            		<SvgXml xml={Images.icons.right_arrow_white} width={10} />
            	</TouchableOpacity>
            ) })} />
            <Drawer.Screen key="drawer-4" name="RelatorioGeral" component={RelatorioGeral} options={{ headerShown: true, title: 'Relatório Geral' }} />
            
        </Drawer.Navigator>
    )
}

export default Routes;