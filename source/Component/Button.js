/* Importações React */
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

/* Importações Plugins */
import { SvgXml } from 'react-native-svg';

/* Importações Locais */
import Styles from '../Service/Styles';

export default function Button({ texto, texto_estilo, botao_estilo, desativado, click, icone, icone_estilo }){
    return(
        <TouchableOpacity style={[Styles.button_default, botao_estilo]} onPress={click} disabled={desativado}>
            <Text style={[Styles.button_default_text, texto_estilo]}>{texto}</Text>
            {icone ? (<>
                <SvgXml xml={icone} width="20" style={[Styles.button_default_icon, icone_estilo]} />
            </>) : null}
        </TouchableOpacity>
    );
}