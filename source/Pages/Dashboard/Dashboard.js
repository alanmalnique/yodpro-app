/* Importações React */
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, SafeAreaView, StatusBar, KeyboardAvoidingView, Keyboard, ImageBackground, Text, TouchableOpacity, Dimensions, Platform, Linking, Image } from 'react-native';

/* Importações Plugins */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SvgXml } from 'react-native-svg';

/* Importações Locais */
import Alert from '../../Component/Alert';
import Button from '../../Component/Button';
import Input from '../../Component/Input';
import Loading from '../../Component/Loading';
import Api from '../../Service/Api';
import Functions from '../../Service/Functions';
import Images from '../../Service/Images';
import Styles from '../../Service/Styles';

export default function Dashboard({ navigation }) {

	// states
	const [loading, setLoading] = useState(false);
    const [alerta, setAlerta] = useState(false);
    const [redirect, setRedirect] = useState('');
    const [alertaTitulo, setAlertaTitulo] = useState('');
    const [alertaTipo, setAlertaTipo] = useState('');
    const [alertaMensagem, setAlertaMensagem] = useState('');

	const [problemas, setProblemas] = useState({
		data: []
	});

	useEffect(() => {
		AsyncStorage.getItem('usuario')
	        .then(res => JSON.parse(res))
	        .then(storage => {
				carregaProblemas(storage.token);
	        });
	}, []);

	const carregaProblemas = async (token) => {
		setLoading(true);
		await Api.get('problema?per_page=5', token)
			.then(result => {
				setLoading(false);
				setProblemas(result)
			})
			.catch(err => {
				setLoading(false);
				setAlertaTipo('atencao');
				setAlertaTitulo('Atenção');
				if (err.sessaoExpirada) {
					setRedirect("Login");
					setAlertaMensagem('Seu login expirou! Você precisa realizar o login novamente.');
				} else {
					setAlertaMensagem(err.mensagem);
				}
				setAlerta(true);
			})
	}

    const fechaAlerta = () => {
        if (redirect) {
            navigation.navigate(redirect);
        } else {
            setAlerta(false);
        }
    }

	return (
		<View style={Styles.view}>
		
			<Loading show={loading} />
            
            <Alert mostrar={alerta} titulo={alertaTitulo} mensagem={alertaMensagem} tipo={alertaTipo} acao_ok={() => { fechaAlerta() }} />

			<SafeAreaView style={Styles.container}>

				<StatusBar backgroundColor="#291286" />

				<ScrollView style={page_style.container}>

					<Text style={[page_style.titulo, Styles.color_gray_300]}>Últimos chamados abertos</Text>

					<View style={[page_style.chamados, Styles.border_gray_100]}>

						{problemas.data.map((item,index) => {
							const isClosed = item.prob_status === 2;
							return (
								<TouchableOpacity style={[page_style.chamado, isClosed ? Styles.border_green : Styles.border_red, index+1 == problemas.data.length ? { marginBottom: 0 } : null]} onPress={() => { navigation.navigate('Detalhes', { id: item.prob_id }) }} key={"chamado-"+index}>

									<View style={page_style.chamado_dados}>

										<Text style={[page_style.chamado_descricao, Styles.color_primary]}>{item.prob_titulo}</Text>

										<View style={page_style.chamado_infos}>
											<View style={page_style.chamado_texto}>
												<Text style={page_style.chamado_titulo_local}>Nº do chamado:</Text>
												<Text style={page_style.chamado_descricao_local}>{item.prob_id}</Text>
											</View>
											<View style={page_style.chamado_texto}>
												<Text style={page_style.chamado_titulo_local}>Local:</Text>
												<Text style={page_style.chamado_descricao_local}>{item.local.loc_descricao}</Text>
											</View>
											<View style={page_style.chamado_texto}>
												<Text style={page_style.chamado_titulo_local}>Data / Hora:</Text>
												<Text style={page_style.chamado_descricao_local}>{Functions.dataHora2Brasileiro(item.prob_datahora)}</Text>
											</View>
											<View style={page_style.chamado_texto}>
												<Text style={page_style.chamado_titulo_local}>Status:</Text>
												<Text style={[page_style.chamado_descricao_local, isClosed ? Styles.color_green : Styles.color_red]}>{item.prob_status === 2 ? 'Resolvido' : 'Aberto'}</Text>
											</View>
										</View>

									</View>
									
									<SvgXml xml={Images.icons.left_arrow} style={page_style.chamado_icone} />

								</TouchableOpacity>
							);
						})}

						{!problemas.data.length ? (<>
							<View style={[page_style.chamado, Styles.border_gray_100, { marginBottom: 0 }]}>

								<View style={page_style.chamado_dados}>

									<Text style={[page_style.chamado_descricao, Styles.color_gray_500]}>Nenhum problema adicionado.</Text>

								</View>

							</View>
						</>) : null}

						{problemas.total > 5 ? (<>
		                	<Button 
		                        texto="Ver todos" 
		                        botao_estilo={[page_style.botao_entrar, Styles.background_primary, { marginTop: 0 }]}
		                        texto_estilo={Styles.color_white}
		                        icone={Images.icons.next}
		                        click={() => { navigation.navigate('Chamados') }} />
		                </>) : null}
							
					</View>

				</ScrollView>

			</SafeAreaView>

		</View>
	)
};

const page_style = StyleSheet.create({
	container: { paddingHorizontal: 0 },
	titulo: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginHorizontal: 20 },
	chamados: { paddingVertical: 20, marginBottom: 20 },
	chamado: { borderLeftWidth: 4, marginHorizontal: 20, borderRadius: 10, paddingBottom: 20, flexDirection: 'row', marginBottom: 20, paddingHorizontal: 20, shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3, elevation: 10, backgroundColor: 'white' },
	chamado_dados: { flex: 1 },
	chamado_icone: { alignSelf: 'center' },
	chamado_descricao: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
	chamado_infos: { flexDirection: 'column', justifyContent: 'space-between', marginTop: 10 },
	chamado_texto: { flexDirection: 'row' },
	chamado_titulo_local: { fontWeight: 'bold', fontSize: 15, marginRight: 10 },
	chamado_descricao_local: { fontSize: 16 },
});