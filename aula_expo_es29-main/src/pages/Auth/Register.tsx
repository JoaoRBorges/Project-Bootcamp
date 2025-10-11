import React from "react"
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import AuthContext from "../../contexts/AuthContext"

export default function RegisterPage() {
	const { signUp } = React.useContext(AuthContext)
	const navigation = useNavigation()

	const [name, setName] = React.useState("")
	const [email, setEmail] = React.useState("")
	const [password, setPassword] = React.useState("")

	async function onRegister() {
		const ok = await signUp(name, email, password)
		if (!ok) {
			alert(
				"Dados inválidos — preencha todos os campos e use senha >= 4 caracteres"
			)
			return
		}
		// após cadastro, volta para app (context já loga o usuário)
	}

	return (
		<View style={styles.safe}>
			<View style={styles.card}>
				<Text style={styles.title}>Crie sua conta</Text>
				<Text style={styles.subtitle}>Informe seus dados abaixo</Text>

				<TextInput
					placeholder='Nome'
					style={styles.input}
					value={name}
					onChangeText={setName}
				/>
				<TextInput
					placeholder='E-mail'
					keyboardType='email-address'
					autoCapitalize='none'
					style={styles.input}
					value={email}
					onChangeText={setEmail}
				/>
				<TextInput
					placeholder='Senha'
					secureTextEntry
					style={styles.input}
					value={password}
					onChangeText={setPassword}
				/>

				<TouchableOpacity style={styles.button} onPress={onRegister}>
					<Text style={styles.buttonText}>Cadastrar</Text>
				</TouchableOpacity>

				<TouchableOpacity onPress={() => navigation.goBack()}>
					<Text style={styles.link}>Voltar ao login</Text>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f2f6fb",
	},
	card: {
		width: "90%",
		maxWidth: 420,
		padding: 24,
		borderRadius: 16,
		backgroundColor: "white",
		shadowColor: "#000",
		shadowOpacity: 0.08,
		shadowRadius: 12,
		elevation: 6,
	},
	title: { fontSize: 22, fontWeight: "700", marginBottom: 4 },
	subtitle: { fontSize: 13, color: "#6b7280", marginBottom: 16 },
	input: {
		borderWidth: 1,
		borderColor: "#e6e9ef",
		padding: 12,
		borderRadius: 10,
		marginBottom: 12,
	},
	button: {
		backgroundColor: "#10b981",
		padding: 14,
		borderRadius: 10,
		alignItems: "center",
		marginTop: 6,
	},
	buttonText: { color: "white", fontWeight: "600" },
	link: { color: "#2563eb", marginTop: 12, textAlign: "center" },
})
