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

export default function LoginPage() {
	const { signIn } = React.useContext(AuthContext)
	const navigation = useNavigation()

	const [email, setEmail] = React.useState("")
	const [password, setPassword] = React.useState("")

	async function onLogin() {
		const ok = await signIn(email, password)
		if (!ok) {
			alert("Credenciais inválidas — senha deve ter ao menos 4 caracteres")
		}
	}

	return (
		<View style={styles.safe}>
			<View style={styles.card}>
				<Text style={styles.title}>Bem-vindo</Text>
				<Text style={styles.subtitle}>Faça login para continuar</Text>

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

				<TouchableOpacity style={styles.button} onPress={onLogin}>
					<Text style={styles.buttonText}>Entrar</Text>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => navigation.navigate("Register" as never)}
				>
					<Text style={styles.link}>Criar uma conta</Text>
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
	title: { fontSize: 24, fontWeight: "700", marginBottom: 4 },
	subtitle: { fontSize: 14, color: "#6b7280", marginBottom: 16 },
	input: {
		borderWidth: 1,
		borderColor: "#e6e9ef",
		padding: 12,
		borderRadius: 10,
		marginBottom: 12,
	},
	button: {
		backgroundColor: "#2563eb",
		padding: 14,
		borderRadius: 10,
		alignItems: "center",
		marginTop: 6,
	},
	buttonText: { color: "white", fontWeight: "600" },
	link: { color: "#2563eb", marginTop: 12, textAlign: "center" },
})
