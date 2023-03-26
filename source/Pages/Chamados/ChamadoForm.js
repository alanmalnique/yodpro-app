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
import Images from '../../Service/Images';
import Styles from '../../Service/Styles';

export default function ChamadoForm({ route, navigation }) {
	/* Props */
	const props = route.params;

	// states
	const [loading, setLoading] = useState(false);
    const [alerta, setAlerta] = useState(false);
    const [redirect, setRedirect] = useState('');
    const [alertaTitulo, setAlertaTitulo] = useState('');
    const [alertaTipo, setAlertaTipo] = useState('');
    const [alertaMensagem, setAlertaMensagem] = useState('');

	const [local, setLocal] = useState('');
	const [user, setUser] = useState({});
	const [titulo, setTitulo] = useState('');
	const [descricao, setDescricao] = useState('');
	const [locais, setLocais] = useState([{
		label: 'Selecione', value: ''
	}]);

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
		await Api.get('locais?per_page=-1', token)
			.then(result => {
				console.log(result);
				setLoading(false);
				var objects = [{
					label: 'Selecione', value: ''
				}];
				for (var i = 0; i < result.data.length; i++) {
					objects.push({
						label: result.data[i].loc_descricao,
						value: result.data[i].loc_id
					});
				}
				setLocais(objects);
				console.log(props);
			    if (props !== undefined) {
			    	setLocal(props.local.loc_id);
			    	setTitulo(props.prob_titulo);
			    	setDescricao(props.prob_descricao);
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

	const validaChamado = () => {
		if (local === '') {
			setAlertaMensagem('Preencha o campo local corretamente!');
			setAlertaTipo('atencao');
			setAlerta(true);
		} else if (titulo === '') {
			setAlertaMensagem('Preencha o campo título corretamente!');
			setAlertaTipo('atencao');
			setAlerta(true);
		} else if (descricao === '') {
			setAlertaMensagem('Preencha o campo descrição corretamente!');
			setAlertaTipo('atencao');
			setAlerta(true);
		} else {
			Keyboard.dismiss();
	        setLoading(true);
	        const form = {
	        	prob_titulo: titulo,
	        	loc_id: local,
	        	prob_descricao: descricao
	        };
	        if (props !== undefined) {
	        	alteraChamado(form);
	        } else {
	        	salvaChamado(form);
	        }
	    }
	}

	const salvaChamado = async (form) => {
        await Api.post('problema', form, user.token)
            .then(async (result) => {
                setLoading(false);
                navigation.navigate("Detalhes", { id: result.data.prob_id });
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

	const alteraChamado = async (form) => {
        await Api.put('problema/'+props.prob_id, form, user.token)
            .then(async (result) => {
                setLoading(false);
                navigation.navigate("Detalhes", { id: props.prob_id });
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

					<Text style={[page_style.titulo, Styles.color_primary]}>{props !== undefined ? 'Alterar' : 'Novo'} Chamado</Text>

					<View style={page_style.form}>

	            		<Input tipo="select" label="Local" opcoes={locais} change={(e) => { setLocal(e); }} value={local} />

	            		<Input tipo="texto" label="Título" change={(value) => { setTitulo(value); }} value={titulo} />

	            		<Input tipo="textarea" label="Descrição" change={(value) => { setDescricao(value); }} value={descricao} />

	                	<Button 
	                        texto="Salvar" 
	                        botao_estilo={[page_style.botao_entrar, Styles.background_primary]}
	                        texto_estilo={Styles.color_white}
	                        icone={Images.icons.next}
	                        click={() => { validaChamado() }} />

					</View>

				</ScrollView>

			</SafeAreaView>

		</View>
	)
};

const page_style = StyleSheet.create({
	container: { paddingHorizontal: 20 },
	action_button: { position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderRadius: 100 },
	action_button_icon: { marginTop: 16, marginLeft: 16 },
	titulo: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
	form: { marginTop: 20 }
});