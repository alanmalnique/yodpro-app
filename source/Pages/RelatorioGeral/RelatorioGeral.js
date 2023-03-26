/* Importações React */
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, SafeAreaView, StatusBar, KeyboardAvoidingView, Keyboard, ImageBackground, Text, TouchableOpacity, Dimensions, Platform, Linking, Image, PermissionsAndroid } from 'react-native';

/* Importações Plugins */
import AsyncStorage from '@react-native-async-storage/async-storage';
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

export default function RelatorioGeral({ navigation }) {

	// states
	const [loading, setLoading] = useState(false);
    const [alerta, setAlerta] = useState(false);
    const [redirect, setRedirect] = useState('');
    const [alertaTitulo, setAlertaTitulo] = useState('');
    const [alertaTipo, setAlertaTipo] = useState('');
    const [alertaMensagem, setAlertaMensagem] = useState('');

	const [user, setUser] = useState({});
    const [chamado, setChamado] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [status, setStatus] = useState('');
    const [local, setLocal] = useState('');
	const [filtroOptions, setFiltroOptions] = useState([
		{ label: 'Nenhum', value: '' },
		{ label: 'Abertos', value: 1},
		{ label: 'Resolvidos', value: 2 }
	]);
	const [locaisOptions, setLocaisOptions] = useState([
		{ label: 'Selecione', value: '' }
	]);

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

			var url = '/problema/relatorio/gerar?xls=true';
	        if (dataInicio) url = url + '&data_inicio=' + Functions.data2Americano(dataInicio);
	        if (dataFim) url = url + '&data_fim=' + Functions.data2Americano(dataFim);
	        if (status) url = url + '&status=' + status;
	        if (local) url = url + '&local=' + local;
	        if (chamado) url = url + '&id=' + chamado;
	        console.log(Api.ApiUrl() + url);
			
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

				<ScrollView style={page_style.container}>

					<Text style={[page_style.titulo, Styles.color_primary]}>Filtros</Text>

						<View style={page_style.form}>
	            			<Input tipo="select" label="Status" opcoes={filtroOptions} change={(e) => { setStatus(e); }} value={status} />

	            			<Input tipo="select" label="Local" opcoes={locaisOptions} change={(e) => { setLocal(e); }} value={local} />

	            			<Input tipo="numerico" label="Número do chamado" change={(e) => { setChamado(e); }} value={chamado} />

	            			<Input tipo="numerico" label="Data de início" change={(e) => { setChamado(e); }} value={chamado} />

	            			<Input tipo="numerico" label="Data de fim" change={(e) => { setChamado(e); }} value={chamado} />

		                	<Button 
		                        texto="Gerar Relatório (.xls)" 
		                        botao_estilo={[page_style.botao_filtrar, Styles.background_primary]}
		                        texto_estilo={Styles.color_white}
		                        icone={Images.icons.next}
		                        click={() => { geraRelatorio() }} />
	            		</View>

				</ScrollView>

			</SafeAreaView>

		</View>
	)
};

const page_style = StyleSheet.create({
	container: { paddingHorizontal: 20 },
	action_button: { position: 'absolute', bottom: 20, right: 20, width: 60, height: 60, borderRadius: 100, zIndex: 2 },
	action_button_icon: { marginTop: 16, marginLeft: 16 },
	titulo: { fontSize: 20, fontWeight: 'bold', marginVertical: 20 },
	filtro_form: { padding: 20 },
	botao_filtrar: { marginTop: 'auto' }
});