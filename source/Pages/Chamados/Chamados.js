/* Importações React */
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, SafeAreaView, StatusBar, KeyboardAvoidingView, Keyboard, ImageBackground, Text, TouchableOpacity, Dimensions, Platform, Linking, Image } from 'react-native';

/* Importações Plugins */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FloatingButton, FloatingButtonChild } from "react-native-action-floating-button";
import Modal from "react-native-modal";
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

export default function Chamados({ navigation }) {

	// states
	const [loading, setLoading] = useState(false);
    const [alerta, setAlerta] = useState(false);
    const [redirect, setRedirect] = useState('');
    const [alertaTitulo, setAlertaTitulo] = useState('');
    const [alertaTipo, setAlertaTipo] = useState('');
    const [alertaMensagem, setAlertaMensagem] = useState('');

	const [user, setUser] = useState({});
    const [pagina, setPagina] = useState(0);
	const [modalFiltro, setModalFiltro] = useState(false);
	const [ultimoRegistro, setUltimoRegistro] = useState(false);
	const [filtro, setFiltro] = useState('');
	const [id, setId] = useState('');
    const [local, setLocal] = useState('');
	const [filtroOptions, setFiltroOptions] = useState([
		{ label: 'Nenhum', value: '' },
		{ label: 'Abertos', value: 1},
		{ label: 'Resolvidos', value: 2 }
	]);
	const [locaisOptions, setLocaisOptions] = useState([
		{ label: 'Selecione', value: '' }
	]);

	const [problemas, setProblemas] = useState([]);

	useEffect(() => {
		AsyncStorage.getItem('usuario')
	        .then(res => JSON.parse(res))
	        .then(storage => {
	        	setUser(storage);
				carregaLocais(storage.token);
	        });
	}, []);

	const carregaLocais = async (token) => {
		setLoading(true);
		var url = 'locais?per_page=-1';
		await Api.get(url, token)
			.then(result => {
				setLoading(false);
				const res = result.data;
				var objects = [{ label: 'Selecione', value: '' }];
				for (var i = 0; i < res.length; i++) {
					const item = res[i];
					objects.push({ label: item.loc_descricao, value: item.loc_id });
				}
				setLocaisOptions(objects);
				carregaProblemas(token);
			})
			.catch(err => {
				console.log(err);
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

	const carregaProblemas = async (token) => {
		setLoading(true);
		setPagina(pagina+1);
		var url = 'problema?per_page=20';
		if (filtro !== '') {
			url += '&status='+filtro;
		}
		if (local !== '') {
			url += '&local='+local;
		}
		if (id !== '') {
			url += '&id='+id;
		}
		await Api.get(url, token)
			.then(result => {
				setLoading(false);
				setModalFiltro(false);
				setProblemas(result.data);
				if (pagina+1 === result.last_page) {
					setUltimoRegistro(true);
				}
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

	const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
		if (ultimoRegistro) {
			return false;
		}
	    const paddingToBottom = 100;
	    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
	};

	const filtrar = () => {
		setPagina(0);
		setModalFiltro(false);
		carregaProblemas(user.token);
	}

    const fechaAlerta = () => {
        if (redirect) {
            navigation.navigate(redirect);
        } else {
            setAlerta(false);
        }
    }

    const resolveTitle = () => {
    	var title = '';
    	if (filtro === '' && local === '' && id === '') {
    		title = 'Todos os chamados';
    	} else {
    		title = 'Filtrando por: ';
    		var filters = [];
    		if (filtro !== '') {
    			filters.push(filtro === 1 ? 'Chamados Abertos' : 'Chamados Resolvidos');
    		}
    		if (local !== '') {
    			var localName = '';
    			locaisOptions.forEach((item, index) => {
    				if (item.value === local) {
    					localName = item.label;
    				}
    			})
    			filters.push('em '+localName);
    		}
    		if (id !== '') {
    			filters.push('Chamado nº '+id);
    		}
    		title += filters.join(", ");
    	}
    	return title;
    }

	return (
		<View style={Styles.view}>
		
			<Loading show={loading} />
            
            <Alert mostrar={alerta} titulo={alertaTitulo} mensagem={alertaMensagem} tipo={alertaTipo} acao_ok={() => { fechaAlerta() }} />

			<SafeAreaView style={Styles.container}>

				<StatusBar backgroundColor="#291286" />

                <Modal isVisible={modalFiltro} animationType="slide">
                    <View style={{ width: '100%', height: '100%', backgroundColor: 'white', borderRadius: 10, flexDirection: 'column' }}>
                    	<View style={[page_style.filtro_titulo, Styles.background_gray_50]}>
                    		<Text style={[page_style.filtro_titulo_texto, Styles.color_secondary]}>Filtrar</Text>
                    		<TouchableOpacity style={page_style.filtro_titulo_icone} onPress={() => { setModalFiltro(false); }}>
								<SvgXml xml={Images.icons.close_dark} />
                    		</TouchableOpacity>
                    	</View>
                    	<View style={page_style.filtro_form}>
	            			<Input tipo="select" label="Status" opcoes={filtroOptions} change={(e) => { setFiltro(e); }} value={filtro} />

	            			<Input tipo="select" label="Local" opcoes={locaisOptions} change={(e) => { setLocal(e); }} value={local} />

	            			<Input tipo="numerico" label="Número do chamado" change={(e) => { setId(e); }} value={id} />

		                	<Button 
		                        texto="Filtrar" 
		                        botao_estilo={[page_style.botao_filtrar, Styles.background_primary]}
		                        texto_estilo={Styles.color_white}
		                        icone={Images.icons.next}
		                        click={() => { filtrar() }} />
	            		</View>
                    </View>
                </Modal>

				<FloatingButton hasChildren={true} icon={<SvgXml xml={Images.icons.more} />} backgroundColor="#291286">
				    <FloatingButtonChild backgroundColor="#369EE9" title="Filtrar" onPress={() => { setModalFiltro(true); }}>
				        <SvgXml xml={Images.icons.filter} />
				    </FloatingButtonChild>
				    <FloatingButtonChild backgroundColor="#13A73D" title="Novo" onPress={() => { navigation.navigate('Chamado') }}>
				        <SvgXml xml={Images.icons.add} />
				    </FloatingButtonChild>
				</FloatingButton>

				<ScrollView style={page_style.container} onScroll={({nativeEvent}) => {
			        if (isCloseToBottom(nativeEvent)) {
			        	carregaProblemas(user.token);
			        }
			    }}>

					<Text style={[page_style.titulo, Styles.color_primary]}>{resolveTitle()}</Text>

					<View style={[page_style.chamados, Styles.border_gray_100]}>

						{problemas.map((item,index) => {
							const isClosed = item.prob_status === 2;
							return (
								<TouchableOpacity style={[page_style.chamado, isClosed ? Styles.border_green : Styles.border_red, index+1 == problemas.length ? { marginBottom: 0 } : null]} onPress={() => { navigation.navigate('Detalhes', { id: item.prob_id }) }} key={"chamado-"+index}>

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

						{!problemas.length ? (<>
							<View style={[page_style.chamado, Styles.border_gray_100, { marginBottom: 0 }]}>

								<View style={page_style.chamado_dados}>

									<Text style={[page_style.chamado_descricao, Styles.color_gray_500]}>Nenhum problema adicionado.</Text>

								</View>

							</View>
						</>) : null}
							
					</View>

				</ScrollView>

			</SafeAreaView>

		</View>
	)
};

const page_style = StyleSheet.create({
	container: { paddingHorizontal: 0 },
	action_button: { position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderRadius: 100 },
	action_button_icon: { marginTop: 16, marginLeft: 16 },
	titulo: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
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
	filtro_titulo: { padding: 15, borderTopLeftRadius: 10, borderTopRightRadius: 10, flexDirection: 'row' },
	filtro_titulo_texto: { fontSize: 20, fontWeight: 'bold' },
	filtro_titulo_icone: { alignSelf: 'center', marginLeft: 'auto' },
	filtro_form: { padding: 20 },
	botao_filtrar: { marginTop: 'auto' }
});