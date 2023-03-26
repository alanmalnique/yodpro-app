/* Importações React */
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, SafeAreaView, StatusBar, KeyboardAvoidingView, Keyboard, ImageBackground, Text, TouchableOpacity, Dimensions, Platform, Linking, Image, PermissionsAndroid } from 'react-native';

/* Importações Plugins */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FloatingButton, FloatingButtonChild } from "react-native-action-floating-button";
import Modal from "react-native-modal";
import RNFetchBlob from "rn-fetch-blob";
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

export default function ChamadoDetalhe({ route, navigation }) {
	/* Props */
	const props = route.params;

	// states
	const [loading, setLoading] = useState(false);
    const [alerta, setAlerta] = useState(false);
    const [redirect, setRedirect] = useState('');
    const [alertaTitulo, setAlertaTitulo] = useState('');
    const [alertaTipo, setAlertaTipo] = useState('');
    const [alertaMensagem, setAlertaMensagem] = useState('');

	const [modalComentario, setModalComentario] = useState(false);
    const [comentario, setComentario] = useState('');

    const [chamado, setChamado] = useState({
    	prob_datahora: '0000-00-00 00:00:00',
    	local: {},
    	comentarios: []
    });
	const [user, setUser] = useState({});
	const [statusOptions, setStatusOptions] = useState([
		{ label: 'Nenhum', value: '' },
		{ label: 'Abertos', value: 1 },
		{ label: 'Resolvidos', value: 2 }
	]);

	useEffect(() => {
		AsyncStorage.getItem('usuario')
	        .then(res => JSON.parse(res))
	        .then(storage => {
	        	setUser(storage);
				carregaChamado(storage.token);
	        });
	}, []);

	const carregaChamado = async (token) => {
		setLoading(true);
		await Api.get('problema/'+props.id, token)
			.then(result => {
				console.log(result);
				setLoading(false);
				setChamado(result.data);
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

	const alteraStatus = async (status) => {
		setLoading(true);
		await Api.put('problema/'+props.id, { prob_status: status }, user.token)
			.then(result => {
				setLoading(false);
				carregaChamado(user.token);
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

	const adicionarComentario = async () => {
		if (comentario === '') {
			setAlertaTipo('atencao');
			setAlertaTitulo('Atenção');
			setAlertaMensagem('Preencha o campo comentário corretamente.');
			setAlerta(true);
		} else {
			setLoading(true);
			await Api.post('problema/comentario', { probc_comentario: comentario, prob_id: chamado.prob_id }, user.token)
				.then(result => {
					setLoading(false);
					setComentario('');
					carregaChamado(user.token);
					setModalComentario(false);
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
	}

    const fechaAlerta = () => {
        if (redirect) {
            navigation.navigate(redirect);
        } else {
            setAlerta(false);
        }
    }

    const geraRelatorio = async () => {
    	setLoading(true);
        var granted = true, grantedValue = true;
		if (Platform.OS == 'android') {
			granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
			grantedValue = PermissionsAndroid.RESULTS.GRANTED
		}
		if (granted === grantedValue) {
			let dirs = RNFetchBlob.fs.dirs;
			console.log(dirs);
			var config = {
				fileCache: true,
				addAndroidDownloads: {
					useDownloadManager: true,
					notification: true,
					mediaScannable: true,
					title: 'Relatorio.xlsx',
					path: `${dirs.DownloadDir}/Relatorio.xlsx`,
				}
			};

			var url = '/problema/'+props.id+'/relatorio/gerar';
			
			RNFetchBlob.config(config).fetch('GET', Api.ApiUrl() + url, {
				  Authorization: "Bearer " + user.token,
				})
			    .then((resp) => {
			    	RNFetchBlob.android.actionViewIntent(resp.path(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    				setLoading(false);
			    })
			    .catch((err) => {
    				setLoading(false);
			    })
		} else {
			setTimeout(function(){
				setLoading(false);
			}, 500);
			setAlertaTipo('atencao');
			setAlertaTitulo('Atenção');
			setAlertaMensagem('Você não deu a permissão para download de arquivos!');
			setTimeout(function(){
				setAlerta(true);
			}, 500);
		}
    }

	return (
		<View style={Styles.view}>
		
			<Loading show={loading} />
            
            <Alert mostrar={alerta} titulo={alertaTitulo} mensagem={alertaMensagem} tipo={alertaTipo} acao_ok={() => { fechaAlerta() }} />

			<SafeAreaView style={Styles.container}>

				<StatusBar backgroundColor="#291286" />

                <Modal isVisible={modalComentario} animationType="slide">
                    <View style={{ width: '100%', height: '100%', backgroundColor: 'white', borderRadius: 10, flexDirection: 'column' }}>
                    	<View style={[page_style.filtro_titulo, Styles.background_gray_50]}>
                    		<Text style={[page_style.filtro_titulo_texto, Styles.color_secondary]}>Adicionar comentário</Text>
                    		<TouchableOpacity style={page_style.filtro_titulo_icone} onPress={() => { setModalComentario(false); setComentario(''); }}>
								<SvgXml xml={Images.icons.close_dark} />
                    		</TouchableOpacity>
                    	</View>
                    	<View style={page_style.filtro_form}>

	            			<Input tipo="textarea" label="Comentário" change={(e) => { setComentario(e); }} value={comentario} />

		                	<Button 
		                        texto="Adicionar" 
		                        botao_estilo={[page_style.botao_filtrar, Styles.background_primary]}
		                        texto_estilo={Styles.color_white}
		                        icone={Images.icons.next}
		                        click={() => { adicionarComentario() }} />
	            		</View>
                    </View>
                </Modal>

				<FloatingButton hasChildren={true} icon={<SvgXml xml={Images.icons.more} />} backgroundColor="#291286">
					{chamado.prob_status === 1 ? (<>
					    <FloatingButtonChild backgroundColor="#13A73D" title="Editar chamado" onPress={() => { navigation.navigate('Chamado', chamado); }}>
					        <SvgXml xml={Images.icons.edit} />
					    </FloatingButtonChild>
					    <FloatingButtonChild backgroundColor="#369EE9" title="Marcar como resolvido" onPress={() => { alteraStatus(2) }}>
					        <SvgXml xml={Images.icons.success} />
					    </FloatingButtonChild>
					</>) : (<>
					    <FloatingButtonChild backgroundColor="#369EE9" title="Marcar como aberto" onPress={() => { alteraStatus(1) }}>
					        <SvgXml xml={Images.icons.success} />
					    </FloatingButtonChild>
					   </>)}
				    <FloatingButtonChild backgroundColor="#369EE9" title="Gerar Relatório" onPress={() => { geraRelatorio(); }}>
				        <SvgXml xml={Images.icons.filter} />
				    </FloatingButtonChild>
				</FloatingButton>

				<ScrollView style={page_style.container}>

					<Text style={[page_style.titulo, Styles.color_primary]}>{chamado.prob_titulo}</Text>

					<View style={page_style.chamado_infos}>
						<View style={page_style.chamado_texto}>
							<Text style={page_style.chamado_titulo_local}>Nº do chamado:</Text>
							<Text style={page_style.chamado_descricao_local}>{chamado.prob_id}</Text>
						</View>
						<View style={page_style.chamado_texto}>
							<Text style={page_style.chamado_titulo_local}>Local:</Text>
							<Text style={page_style.chamado_descricao_local}>{chamado.local.loc_descricao}</Text>
						</View>
						<View style={page_style.chamado_texto}>
							<Text style={page_style.chamado_titulo_local}>Data / Hora:</Text>
							<Text style={page_style.chamado_descricao_local}>{Functions.dataHora2Brasileiro(chamado.prob_datahora)}</Text>
						</View>
						<View style={page_style.chamado_texto}>
							<Text style={page_style.chamado_titulo_local}>Status:</Text>
							<Text style={[page_style.chamado_descricao_local, chamado.prob_status === 2 ? Styles.color_green : Styles.color_red]}>{chamado.prob_status === 2 ? 'Resolvido' : 'Aberto'}</Text>
						</View>
					</View>

					<Text style={[page_style.titulo, Styles.color_primary]}>Comentários</Text>

					<View style={[page_style.box_comentarios, Styles.border_gray_100]}>

						{chamado.comentarios.map((item, index) => {
							return (
								<View style={[page_style.comentario, Styles.border_gray_100, index+1 === chamado.comentarios.length ? { borderBottomWidth: 0, marginBottom: 0 } : null]} key={"comentario"+index}>
										<Text style={[page_style.comentario_nome, Styles.color_primary]}>{item.usuario.usu_nome}</Text>
										<Text style={[page_style.comentario_datahora, Styles.color_gray_400]}>{Functions.dataHora2Brasileiro(item.probc_datahora)}</Text>
									<Text style={page_style.comentario_texto}>{item.probc_comentario}</Text>
								</View>
							);
						})}

						{!chamado.comentarios.length ? (<>
							<Text>Nenhum comentário adicionado.</Text>
						</>) : null}

						{chamado.prob_status < 2 ? (<>
		                	<Button 
		                        texto="Adicionar comentário" 
		                        botao_estilo={[Styles.background_primary, { marginTop: 0 }]}
		                        texto_estilo={Styles.color_white}
		                        icone={Images.icons.add}
		                        click={() => { setModalComentario(true) }} />
		                </>) : null}

					</View>

				</ScrollView>

			</SafeAreaView>

		</View>
	)
};

const page_style = StyleSheet.create({
	container: { paddingHorizontal: 20 },
	action_button: { position: 'absolute', bottom: 20, right: 20, height: 60, borderRadius: 20 },
	action_button_icon: { marginTop: 16, marginLeft: 16 },
	titulo: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
	chamado_infos: { flexDirection: 'column', justifyContent: 'space-between', marginTop: 10 },
	chamado_texto: { flexDirection: 'row' },
	chamado_titulo_local: { fontWeight: 'bold', fontSize: 15, marginRight: 10 },
	chamado_descricao_local: { fontSize: 16 },
	box_comentarios: { borderWidth: 1, borderRadius: 10, padding: 20, marginTop: 10, marginBottom: 20 },
	comentario: { borderBottomWidth: 1, paddingBottom: 10, marginBottom: 20 },
	comentario_titulo: { flexDirection: 'row', justifyContent: 'space-between' },
	comentario_nome: { fontSize: 18, fontWeight: 'bold' },
	comentario_datahora: { fontSize: 14, fontWeight: 'bold' },
	comentario_texto: { marginTop: 10, fontSize: 18 },
	filtro_titulo: { padding: 15, borderTopLeftRadius: 10, borderTopRightRadius: 10, flexDirection: 'row' },
	filtro_titulo_texto: { fontSize: 20, fontWeight: 'bold' },
	filtro_titulo_icone: { alignSelf: 'center', marginLeft: 'auto' },
	filtro_form: { padding: 20 },
	botao_filtrar: { marginTop: 'auto' }
});