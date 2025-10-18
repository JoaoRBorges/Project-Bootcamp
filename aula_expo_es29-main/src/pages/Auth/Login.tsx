import React from "react"
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ImageBackground,
	KeyboardAvoidingView,
	Platform,
	StatusBar,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import AuthContext from "../../contexts/AuthContext"

export default function LoginPage() {
	const { signIn } = React.useContext(AuthContext)
	const navigation = useNavigation()

	const [email, setEmail] = React.useState("")
	const [password, setPassword] = React.useState("")
	const [focusedInput, setFocusedInput] = React.useState<string | null>(null)

	const [displayPassword, setDisplayPassword] = React.useState("")
	const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

	async function onLogin() {
		console.log("Tentando logar com", email, password)
		const ok = await signIn(email, password)
		if (!ok) {
			alert("Credenciais inválidas — senha deve ter ao menos 4 caracteres")
		}
	}
	

	function handlePasswordChange(text: string) {
		// Identifica se está apagando ou digitando
		const isDeleting = text.length < displayPassword.length

		if (isDeleting) {
			// Se está apagando, remove do password real
			setPassword(password.slice(0, text.length))
			setDisplayPassword(text.length > 0 ? "•".repeat(text.length - 1) + password.slice(text.length - 1, text.length) : "")
		} else {
			// Se está digitando, pega apenas o novo caractere
			const newChar = text.slice(-1)
			const newPassword = password + newChar
			setPassword(newPassword)

			// Mostra máscara com último caractere visível
			setDisplayPassword("•".repeat(newPassword.length - 1) + newChar)
		}

		// Limpa o timeout anterior
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}

		// Após 800ms, mascara tudo
		if (text.length > 0) {
			timeoutRef.current = setTimeout(() => {
				setDisplayPassword("•".repeat(password.length + (isDeleting ? 0 : 1)))
			}, 800)
		}
	}

	React.useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [])

	return (
		<>
			<StatusBar barStyle="light-content" />
			<ImageBackground
				source={require("../image/background.png")} // Ajuste o caminho conforme seu projeto
				style={styles.background}
				resizeMode="cover"
			>
				<View style={styles.overlay} />

				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : "height"}
					style={styles.safe}
				>
					<View style={styles.card}>
						{/* Header */}
						<View style={styles.header}>
							<Text style={styles.title}>Bem-vindo</Text>
							<Text style={styles.subtitle}>Faça login para continuar</Text>
						</View>

						{/* Email Input */}
						<View style={styles.inputContainer}>
							<Text style={styles.label}>E-mail</Text>
							<View
								style={[
									styles.inputWrapper,
									focusedInput === "email" && styles.inputWrapperFocused,
								]}
							>
								<TextInput
									placeholder="seu@email.com"
									placeholderTextColor="#9ca3af"
									keyboardType="email-address"
									autoCapitalize="none"
									style={styles.input}
									value={email}
									onChangeText={setEmail}
									onFocus={() => setFocusedInput("email")}
									onBlur={() => setFocusedInput(null)}
								/>
							</View>
						</View>

						{/* Password Input */}
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Senha</Text>
							<View
								style={[
									styles.inputWrapper,
									focusedInput === "password" && styles.inputWrapperFocused,
								]}
							>
								{/* <TextInput
									placeholder="••••••••"
									placeholderTextColor="#9ca3af"
									secureTextEntry
									style={styles.input}
									value={password}
									onChangeText={setPassword}
									onFocus={() => setFocusedInput("password")}
									onBlur={() => setFocusedInput(null)}
								/> */}
								<TextInput
									placeholder="••••••••"
									placeholderTextColor="#9ca3af"
									style={styles.input}
									value={displayPassword}
									onChangeText={handlePasswordChange}
									onFocus={() => setFocusedInput("password")}
									onBlur={() => setFocusedInput(null)}
									autoCapitalize="none"
									autoCorrect={false}
								/>
							</View>
						</View>

						{/* Login Button */}
						<TouchableOpacity
							style={styles.button}
							onPress={onLogin}
							activeOpacity={0.8}
						>
							<Text style={styles.buttonText}>Entrar</Text>
						</TouchableOpacity>

						{/* Divider */}
						<View style={styles.divider}>
							<View style={styles.dividerLine} />
							<Text style={styles.dividerText}>ou</Text>
							<View style={styles.dividerLine} />
						</View>

						{/* Links */}
						<TouchableOpacity
							onPress={() => navigation.navigate("Register" as never)}
						>
							<Text style={styles.link}>Criar uma conta</Text>
						</TouchableOpacity>

						<TouchableOpacity>
							<Text style={styles.link}>Entrada sem registro</Text>
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
			</ImageBackground>
		</>
	)
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
		width: "100%",
		height: "100%",
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(255, 255, 255, 0.15)",
	},
	safe: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	card: {
		width: "90%",
		maxWidth: 420,
		padding: 32,
		borderRadius: 24,
		backgroundColor: "rgba(255, 255, 255, 0.95)",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.15,
		shadowRadius: 20,
		elevation: 10,
	},
	header: {
		marginBottom: 32,
		alignItems: "center",
	},
	title: {
		fontSize: 32,
		fontWeight: "700",
		color: "#111827",
		marginBottom: 8,
		letterSpacing: -0.5,
	},
	subtitle: {
		fontSize: 15,
		color: "#6b7280",
		fontWeight: "400",
	},
	inputContainer: {
		marginBottom: 20,
	},
	label: {
		fontSize: 14,
		fontWeight: "600",
		color: "#374151",
		marginBottom: 8,
		marginLeft: 4,
	},
	inputWrapper: {
		borderWidth: 2,
		borderColor: "#e5e7eb",
		borderRadius: 12,
		backgroundColor: "#f9fafb",
	},
	inputWrapperFocused: {
		borderColor: "#2563eb",
		backgroundColor: "#ffffff",
	},
	input: {
		padding: 14,
		fontSize: 15,
		color: "#111827",
	},
	button: {
		backgroundColor: "#2563eb",
		padding: 16,
		borderRadius: 12,
		alignItems: "center",
		marginTop: 6,
		shadowColor: "#2563eb",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 4,
	},
	buttonText: {
		color: "#ffffff",
		fontWeight: "700",
		fontSize: 16,
		letterSpacing: 0.5,
	},
	divider: {
		flexDirection: "row",
		alignItems: "center",
		marginVertical: 24,
	},
	dividerLine: {
		flex: 1,
		height: 1,
		backgroundColor: "#e5e7eb",
	},
	dividerText: {
		marginHorizontal: 16,
		color: "#9ca3af",
		fontSize: 14,
		fontWeight: "500",
	},
	link: {
		color: "#2563eb",
		marginTop: 12,
		textAlign: "center",
		fontSize: 14,
		fontWeight: "600",
	},
})