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
import Images from '../../Service/Images';
import Styles from '../../Service/Styles';

export default function Login({ navigation }) {

	// states
	const [loading, setLoading] = useState(false);
    const [alerta, setAlerta] = useState(false);
    const [redirect, setRedirect] = useState('');
    const [alertaTitulo, setAlertaTitulo] = useState('');
    const [alertaTipo, setAlertaTipo] = useState('');
    const [alertaMensagem, setAlertaMensagem] = useState('');

	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');

	const realizaLogin = async () => {
		if (email === '') {
			setAlertaMensagem('Preencha o campo email corretamente!');
			setAlertaTipo('atencao');
			setAlerta(true);
		} else if (senha === '') {
			setAlertaMensagem('Preencha o campo senha corretamente!');
			setAlertaTipo('atencao');
			setAlerta(true);
		} else {
			Keyboard.dismiss();
	        setLoading(true);
	        const form = {
	        	email: email,
	        	senha: senha
	        };
	        await Api.post('login', form)
	            .then(async (result) => {
	            	console.log(result);
	                setLoading(false);
               		AsyncStorage.setItem('usuario', JSON.stringify(result.data));
                    navigation.navigate("Drawer");
	            })
	            .catch(err => {
	            	console.log(err);
	                setLoading(false);
                    setAlertaMensagem('Email e/ou senha inválidos!');
					setAlertaTipo('erro');
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

	return (
		<View style={Styles.view}>
		
			<Loading show={loading} />
            
            <Alert mostrar={alerta} titulo={alertaTitulo} mensagem={alertaMensagem} tipo={alertaTipo} acao_ok={() => { fechaAlerta() }} />

			<SafeAreaView style={Styles.container}>

				<SvgXml xml={Images.logo} width="200" style={page_style.logo} />

				<View style={page_style.view_login}>

	            	<Input tipo="email" label="Email" change={(value) => { setEmail(value); }} value={email} />
	            	<Input tipo="senha" label="Senha" change={(value) => { setSenha(value); }} value={senha} />

                	<Button 
                        texto="Entrar" 
                        botao_estilo={[page_style.botao_entrar, Styles.background_primary]}
                        texto_estilo={Styles.color_white}
                        icone={Images.icons.next}
                        click={() => { realizaLogin() }} />

	            </View>

			</SafeAreaView>

		</View>
	)
};

const page_style = StyleSheet.create({
	logo: { alignSelf: 'flex-start', marginLeft: 'auto', marginRight: 'auto', marginVertical: 50 },
	view_login: { padding: 20 },
	botao_entrar: { marginTop: 20 }
});