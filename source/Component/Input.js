/* Importações React */
import React, { useState } from 'react';
import { TextInput, Text, View, TouchableOpacity } from 'react-native';

/* Importações Plugins */
import { TextInputMask } from 'react-native-masked-text';
import { Picker } from '@react-native-picker/picker';

/* Importações Locais */
import Styles from '../Service/Styles';

export default function Input({ tipo, value, estilo, label, label_estilo, change, helper, view_estilo, opcoes, referencia, nome, ...props }){
    
    const [showPassword, setShowPassword] = useState(false);

    if (tipo === 'cpf' || tipo === 'cnpj') {
        return(<>
            <View style={view_estilo}>
                <Text style={[Styles.label_default, helper ? Styles.color_red_default : (value ? Styles.color_blue_default : Styles.color_gray_200), label_estilo]}>{label}</Text>
                <TextInputMask
                    type={tipo}
                    value={value}
                    style={[Styles.input_default, helper ? Styles.border_red_default : (value ? Styles.border_blue_default : Styles.border_gray_100), estilo]}
                    onChangeText={change}
                    returnKeyType="done"
                    underlineColorAndroid="transparent"
                    keyboardType="numeric"
                    ref={referencia}
                    {...props}
                />
            </View>
        </>);
    } else if (tipo === 'telefone') {
        return(<>
            <View style={view_estilo}>
                <Text style={[Styles.label_default, helper ? Styles.color_red_default : (value ? Styles.color_blue_default : Styles.color_gray_200), label_estilo]}>{label}</Text>
                <TextInputMask
                    type={'cel-phone'}
                    options={{
                        maskType: 'BRL',
                        withDDD: true,
                        dddMask: '(99) '
                    }}
                    value={value}
                    style={[Styles.input_default, helper ? Styles.border_red_default : (value ? Styles.border_blue_default : Styles.border_gray_100), estilo]}
                    onChangeText={change}
                    returnKeyType="done"
                    underlineColorAndroid="transparent"
                    keyboardType="numeric"
                    ref={referencia}
                    {...props}
                />
            </View>
        </>);
    } else if (tipo === 'data') {
        return(<>
            <View style={view_estilo}>
                <Text style={[Styles.label_default, helper ? Styles.color_red_default : (value ? Styles.color_blue_default : Styles.color_gray_200), label_estilo]}>{label}</Text>
                <TextInputMask
                    type="datetime"
                    options={{ format: 'DD/MM/YYYY' }}
                    value={value}
                    style={[Styles.input_default, helper ? Styles.border_red_default : (value ? Styles.border_blue_default : Styles.border_gray_100), estilo]}
                    onChangeText={change}
                    returnKeyType="done"
                    underlineColorAndroid="transparent"
                    keyboardType="numeric"
                    ref={referencia}
                    placeholder="DD/MM/AAAA"
                    {...props}
                />
            </View>
        </>);
    } else if (tipo === 'hora') {
        return(<>
            <View style={view_estilo}>
                <Text style={[Styles.label_default, helper ? Styles.color_red_default : (value ? Styles.color_blue_default : Styles.color_gray_200), label_estilo]}>{label}</Text>
                <TextInputMask
                    type="datetime"
                    options={{ format: 'HH:mm' }}
                    value={value}
                    style={[Styles.input_default, helper ? Styles.border_red_default : (value ? Styles.border_blue_default : Styles.border_gray_100), estilo]}
                    onChangeText={change}
                    returnKeyType="done"
                    underlineColorAndroid="transparent"
                    keyboardType="numeric"
                    ref={referencia}
                    placeholder="HH:mm"
                    {...props}
                />
            </View>
        </>);
    } else if (tipo === 'datahora') {
        return(<>
            <View style={view_estilo}>
                <Text style={[Styles.label_default, helper ? Styles.color_red_default : (value ? Styles.color_blue_default : Styles.color_gray_200), label_estilo]}>{label}</Text>
                <TextInputMask
                    type="datetime"
                    options={{ format: 'DD/MM/YYYY HH:mm' }}
                    value={value}
                    style={[Styles.input_default, helper ? Styles.border_red_default : (value ? Styles.border_blue_default : Styles.border_gray_100), estilo]}
                    onChangeText={change}
                    returnKeyType="done"
                    underlineColorAndroid="transparent"
                    keyboardType="numeric"
                    ref={referencia}
                    placeholder="DD/MM/AAAA HH:mm"
                    {...props}
                />
            </View>
        </>);
    } else if (tipo === 'valor') {
        return(<>
            <View style={view_estilo}>
                <Text style={[Styles.label_default, helper ? Styles.color_red_default : (value ? Styles.color_blue_default : Styles.color_gray_200), label_estilo]}>{label}</Text>
                <TextInputMask
                    type="money"
                    options={{
                        precision: 2,
                        separator: ',',
                        delimiter: '.',
                        unit: 'R$ ',
                        suffixUnit: ''
                    }}
                    value={value}
                    style={[Styles.input_default, helper ? Styles.border_red_default : (value ? Styles.border_blue_default : Styles.border_gray_100), estilo]}
                    onChangeText={change}
                    returnKeyType="done"
                    underlineColorAndroid="transparent"
                    keyboardType="numeric"
                    ref={referencia}
                    {...props}
                />
            </View>
        </>);
    } else if (tipo === 'cep') {
        return(<>
            <View style={view_estilo}>
                <Text style={[Styles.label_default, helper ? Styles.color_red_default : (value ? Styles.color_blue_default : Styles.color_gray_200), label_estilo]}>{label}</Text>
                <TextInputMask
                    type={'zip-code'}
                    value={value}
                    style={[Styles.input_default, helper ? Styles.border_red_default : (value ? Styles.border_blue_default : Styles.border_gray_100), estilo]}
                    onChangeText={change}
                    returnKeyType="done"
                    underlineColorAndroid="transparent"
                    keyboardType="numeric"
                    ref={referencia}
                    {...props}
                />
            </View>
        </>);
    } else if (tipo === 'senha') {
        return (<>
            <View style={view_estilo}>
                <Text style={[Styles.label_default, helper ? Styles.color_red_default : (value ? Styles.color_blue_default : Styles.color_gray_200), label_estilo]}>{label}</Text>
                <TextInput
                    type={'zip-code'}
                    value={value}
                    style={[Styles.input_default, helper ? Styles.border_red_default : (value ? Styles.border_blue_default : Styles.border_gray_100), estilo]}
                    onChangeText={change}
                    returnKeyType="done"
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                    secureTextEntry={!showPassword}
                    ref={referencia}
                    {...props}
                />
            </View>
        </>);
    } else if (tipo === 'email') {
        return (<>
            <View style={view_estilo}>
                <Text style={[Styles.label_default, helper ? Styles.color_red_default : (value ? Styles.color_blue_default : Styles.color_gray_200), label_estilo]}>{label}</Text>
                <TextInput
                    value={value}
                    style={[Styles.input_default, helper ? Styles.border_red_default : (value ? Styles.border_blue_default : Styles.border_gray_100), estilo]}
                    onChangeText={change}
                    returnKeyType="done"
                    underlineColorAndroid="transparent"
                    keyboardType="email-address"
                    autocomplete="email"
                    autoCapitalize="none"
                    ref={referencia}
                    {...props}
                />
            </View>
        </>);
    } else if (tipo === 'numerico') {
        return (<>
            <View style={view_estilo}>
                <Text style={[Styles.label_default, helper ? Styles.color_red_default : (value ? Styles.color_blue_default : Styles.color_gray_200), label_estilo]}>{label}</Text>
                <TextInput
                    value={value}
                    style={[Styles.input_default, helper ? Styles.border_red_default : (value ? Styles.border_blue_default : Styles.border_gray_100), estilo]}
                    onChangeText={change}
                    returnKeyType="done"
                    underlineColorAndroid="transparent"
                    keyboardType="numeric"
                    ref={referencia}
                    {...props}
                />
            </View>
        </>);
    } else if (tipo === 'texto') {
        return (<>
            <View style={view_estilo}>
                <Text style={[Styles.label_default, helper ? Styles.color_red_default : (value ? Styles.color_blue_default : Styles.color_gray_200), label_estilo]}>{label}</Text>
                <TextInput
                    value={value}
                    style={[Styles.input_default, helper ? Styles.border_red_default : (value ? Styles.border_blue_default : Styles.border_gray_100), estilo]}
                    onChangeText={change}
                    returnKeyType="done"
                    underlineColorAndroid="transparent"
                    ref={referencia}
                    {...props}
                />
            </View>
        </>);
    } else if (tipo === 'textarea') {
        return (<>
            <View style={view_estilo}>
                <Text style={[Styles.label_default, helper ? Styles.color_red_default : (value ? Styles.color_blue_default : Styles.color_gray_200), label_estilo]}>{label}</Text>
                <TextInput
                    value={value}
                    style={[Styles.input_default, helper ? Styles.border_red_default : (value ? Styles.border_blue_default : Styles.border_gray_100), estilo]}
                    onChangeText={change}
                    multiline={true}
                    numberOfLines={4}
                    returnKeyType="done"
                    underlineColorAndroid="transparent"
                    ref={referencia}
                    {...props}
                />
            </View>
        </>);
    } else if (tipo === 'select') {
        return (<>
            <View style={[Styles.select_default_view, helper ? Styles.border_red_default : (value ? Styles.border_blue_default : Styles.border_gray_100), view_estilo]}>
                <Text style={[Styles.label_default, helper ? Styles.color_red_default : (value ? Styles.color_blue_default : Styles.color_gray_200), label_estilo]}>{label}</Text>
                <Picker
                    style={[Styles.select_default, helper ? Styles.border_red_default : (value ? Styles.border_blue_default : Styles.border_gray_100), estilo]}
                    selectedValue={value}
                    onValueChange={change}>
                    {opcoes && opcoes.map((item, index) => {
                        return (
                            <Picker.Item label={item.label} value={item.value} key={"select-"+nome+"-"+index} />
                        )
                    })}
                    {!opcoes ? (
                        <Picker.Item label="Nenhum dado disponível" value="" />
                    ) : null}
                </Picker>
            </View>
        </>);
    }
}