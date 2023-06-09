import { StyleSheet } from 'react-native'

export default StyleSheet.create({
	view: { width: '100%', height: '100%', backgroundColor: '#f0f0f0' },
	container: { display: 'flex', flexDirection: 'column', flex: 1 },

	color_primary: { color: '#291286' },
	color_secondary: { color: '#DD5C9C' },
	color_red: { color: '#F15D5A' },
	color_orange: { color: '#F79463' },
	color_white: { color: '#FFFFFF' },
	color_green: { color: '#13A73D' },
	color_black: { color: '#000000' },
	color_gray_50: { color: '#EEEEEE' },
	color_gray_100: { color: '#CCCCCC' },
	color_gray_200: { color: '#AAAAAA' },
	color_gray_300: { color: '#999999' },
	color_gray_400: { color: '#666666' },
	color_gray_500: { color: '#555555' },
	color_gray_600: { color: '#444444' },
	color_gray_700: { color: '#333333' },
	color_gray_800: { color: '#222222' },
	color_gray_900: { color: '#111111' },

	background_primary: { backgroundColor: '#291286' },
	background_secondary: { backgroundColor: '#DD5C9C' },
	background_red: { backgroundColor: '#F15D5A' },
	background_white: { backgroundColor: '#FFFFFF' },
	background_green: { backgroundColor: '#13A73D' },
	background_black: { backgroundColor: '#000000' },
	background_pink: { backgroundColor: '#BB527D' },
	background_gray_50: { backgroundColor: '#EEEEEE' },
	background_gray_100: { backgroundColor: '#CCCCCC' },
	background_gray_200: { backgroundColor: '#AAAAAA' },
	background_gray_300: { backgroundColor: '#999999' },
	background_gray_400: { backgroundColor: '#666666' },
	background_gray_500: { backgroundColor: '#555555' },
	background_gray_600: { backgroundColor: '#444444' },
	background_gray_700: { backgroundColor: '#333333' },
	background_gray_800: { backgroundColor: '#222222' },
	background_gray_900: { backgroundColor: '#111111' },
	
	border_primary: { borderColor: '#291286' },
	border_secondary: { borderColor: '#DD5C9C' },
	border_red: { borderColor: '#F15D5A' },
	border_green: { borderColor: '#8FCE00' },
	border_white: { borderColor: '#FFFFFF' },
	border_black: { borderColor: '#000000' },
	border_pink: { borderColor: '#BB527D' },
	border_gray_50: { borderColor: '#EEEEEE' },
	border_gray_100: { borderColor: '#CCCCCC' },
	border_gray_200: { borderColor: '#AAAAAA' },
	border_gray_300: { borderColor: '#999999' },
	border_gray_400: { borderColor: '#666666' },
	border_gray_500: { borderColor: '#555555' },
	border_gray_600: { borderColor: '#444444' },
	border_gray_700: { borderColor: '#333333' },
	border_gray_800: { borderColor: '#222222' },
	border_gray_900: { borderColor: '#111111' },

	// Buttons
	button_default: { width: '100%', padding: 20, marginTop: 20, borderRadius: 10, flexDirection: 'row' },
	button_default_text: { fontSize: 16, fontWeight: 'bold', marginRight: 10 },
	button_default_icon: { flex: 1, marginLeft: 'auto', alignSelf: 'center' },
	button_custom: { width: '100%', padding: 20, marginTop: 20, borderRadius: 10, flexDirection: 'row' },
	button_custom_icon_left: { marginRight: 10, alignSelf: 'center' },
	button_custom_view: { flex: 1, marginRight: 10, alignSelf: 'center' },
	button_custom_text: { fontSize: 20, fontWeight: 'bold' },
	button_custom_description: { fontSize: 12 },
	button_custom_icon_right: { marginLeft: 'auto', alignSelf: 'flex-end', marginBottom: 10 },

	// Input
	label_default: { fontSize: 16, fontWeight: 'bold' },
	input_default: { fontSize: 20, paddingBottom: 5, borderBottomWidth: 1, marginBottom: 20 },
	select_default: { fontSize: 20, paddingBottom: 5, borderBottomWidth: 1 },
	select_default_view: { borderBottomWidth: 1, marginBottom: 20 },
	input_icon_eye: { position: 'absolute', bottom: 25, right: 0 },

	// Modal
	modal_container: { flex: 1, justifyContent: 'center' },
	modal_popup: { paddingTop: 30, paddingBottom: 30, marginHorizontal: 20, paddingHorizontal: 20, alignItems: 'center', borderRadius: 5 },
	modal_titulo: { fontSize: 25, fontWeight: 'bold', marginTop: 10 },
	modal_mensagem: { fontSize: 18, marginTop: 10, textAlign: 'center' },
    modal_botoes: { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
});