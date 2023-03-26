/* Importações React */
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

/* Importações Plugins */
import { SvgXml } from 'react-native-svg';
import Modal from "react-native-modal";

/* Importações Locais */
import Images from '../Service/Images';
import Styles from '../Service/Styles';
import Button from '../Component/Button';

export default function Alert({ mostrar, titulo, mensagem, tipo, texto_ok, acao_ok, texto_cancelar, acao_cancelar }){
    return(
        <View>
            <Modal isVisible={mostrar} backdropColor="#2A3B5A" backdropOpacity={0.5} animationIn="fadeIn" animationOut="fadeOut">
                <View style={Styles.modal_container}>
                    <View style={[Styles.modal_popup, Styles.background_white]}>
                        {tipo === 'sucesso' ? (<>
                            <SvgXml xml={Images.alert.success} width="60" height="60" />
                            <Text style={[Styles.modal_titulo, Styles.color_green]}>{titulo}</Text>
                        </>) : null}
                        {tipo === 'erro' ? (<>
                            <SvgXml xml={Images.alert.error} width="60" height="60" />
                            <Text style={[Styles.modal_titulo, Styles.color_red_default]}>{titulo}</Text>
                        </>) : null}
                        {tipo === 'atencao' ? (<>
                            <SvgXml xml={Images.alert.warning} width="60" height="60" />
                            <Text style={[Styles.modal_titulo, Styles.color_orange]}>{titulo}</Text>
                        </>) : null}
                        {tipo === 'info' ? (<>
                            <SvgXml xml={Images.alert.info} width="60" height="60" />
                            <Text style={[Styles.modal_titulo, Styles.color_blue_light]}>{titulo}</Text>
                        </>) : null}
                        <Text style={[Styles.modal_mensagem, Styles.color_gray_400]}>{mensagem}</Text>
                        <View style={Styles.modal_botoes}>
                            {acao_cancelar ? (<>
                                <Button 
                                    texto={texto_cancelar !== undefined ? texto_cancelar : "Cancelar"} 
                                    botao_estilo={[Styles.background_gray_50, { width: '47.5%', marginRight: '5%' }]}
                                    texto_estilo={Styles.color_gray_300}
                                    click={acao_cancelar} />
                            </>) : null}
                            <Button 
                                texto={texto_ok ? texto_ok : "OK"} 
                                botao_estilo={[Styles.background_primary, acao_cancelar ? { width: '47.5%' } : {}]}
                                texto_estilo={Styles.color_white}
                                icone={Images.icons.next}
                                click={acao_ok} />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}