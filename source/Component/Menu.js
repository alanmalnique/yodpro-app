/* Importações React */
import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, ScrollView, View, SafeAreaView, StatusBar, Text, TouchableOpacity } from 'react-native';

/* Importações Plugins */
import { SvgXml } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* Importações Locais */
import Button from '../Component/Button';
import Images from '../Service/Images';
import Styles from '../Service/Styles';

export default function Menu({ navigation }) {

	/* States */
	const [data, setData] = useState('');
	const [menus, setMenus] = useState([
		{
			titulo: 'Dashboard', icone: Images.icons.home, acao: 'Dashboard', props: {}
		},
		{
			titulo: 'Chamados', icone: Images.icons.loudspeaker, acao: 'Chamados', props: {}
		},
		{
			titulo: 'Relatório Geral', icone: Images.icons.filter_dark, acao: 'RelatorioGeral', props: {}
		}
	]);

	return (
		<View style={page_style.container}>

			<SafeAreaView style={page_style.safe}>

				<View style={page_style.header}>
					<SvgXml xml={Images.icons.close_dark} width="50" style={page_style.fechar} onPress={() => { navigation.closeDrawer() }} />
				</View>

				<View style={page_style.nome}>
					<Text style={[page_style.saudacao, Styles.color_blue_default]}>Olá Alan!</Text>
				</View>

				<ScrollView contentInsetAdjustmentBehavior="automatic" showsVerticalScrollIndicator={false} contentContainerStyle={page_style.itens}>
					{menus.map((item,index) => {
						return (
							<TouchableOpacity style={page_style.item} key={"side-menu-"+index} onPress={() => { navigation.navigate(item.acao, item.props) }}>
								<SvgXml xml={item.icone} width="30" style={page_style.item_icone} />
								<Text style={[page_style.item_texto, Styles.color_blue_default]}>{item.titulo}</Text>
								<SvgXml xml={Images.icons.left_arrow} width="30" style={page_style.item_icone_acao} />
							</TouchableOpacity>
						)
					})}
					<View style={page_style.botao_sair}>
						<Button 
	                        texto="Sair" 
	                        botao_estilo={[Styles.border_primary, { borderWidth: 1 }]}
	                        texto_estilo={[Styles.color_primary]}
		                    icone={Images.icons.logout_arrow}
	                        click={() => { navigation.navigate('Login') }} />
	                </View>
				</ScrollView>

			</SafeAreaView>
			
		</View>
	)
};

const page_style = StyleSheet.create({
	container: { flex: 1, backgroundColor: 'white', borderTopRightRadius: 20, borderBottomRightRadius: 20 },
	safe: { flex: 1, paddingBottom: 20, paddingTop: 20 },
	header: { flexDirection: 'row', marginLeft: 20, marginRight: 20, marginTop: 20 },
	logo: { marginRight: 'auto' },
	fechar: { alignSelf: 'center', marginLeft: 'auto' },
	nome: { marginTop: 30, marginLeft: 20, marginRight: 20, marginBottom: 20 },
	saudacao: { fontSize: 24, fontWeight: 'bold' },
	data: { fontSize: 12 },
	item: { paddingRight: 20, paddingLeft: 20, paddingTop: 10, paddingBottom: 10, display: 'flex', flexDirection: 'row' },
	item_texto: { alignSelf: 'center' },
	item_icone: { alignSelf: 'center', marginRight: 20 },
	item_icone_acao: { marginLeft: 'auto', alignSelf: 'center' },
	botao_sair: { marginLeft: 20, marginRight: 20 }
});