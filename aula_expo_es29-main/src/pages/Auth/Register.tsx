import React from "react"
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	ToastAndroid,
	Platform,
	Alert,
	ImageBackground,
	KeyboardAvoidingView,
	StatusBar,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import AuthContext from "../../contexts/AuthContext"

export default function RegisterPage() {
	const { signUp } = React.useContext(AuthContext)
	const navigation = useNavigation()

	const [name, setName] = React.useState("")
	const [email, setEmail] = React.useState("")
	const [password, setPassword] = React.useState("")

	const [focusedInput, setFocusedInput] = React.useState<string | null>(null)
	const [displayPassword, setDisplayPassword] = React.useState("")

	const [confirmPassword, setConfirmPassword] = React.useState("")
	const [displayConfirmPassword, setDisplayConfirmPassword] = React.useState("")
	const confirmTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

	const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

	const showMessage = (message: string) => {
		if (Platform.OS === 'android') {
			ToastAndroid.show(message, ToastAndroid.SHORT)
		} else {
			Alert.alert('Aviso', message)
		}
	}

	async function onRegister() {
		if (password !== confirmPassword) {
			showMessage("As senhas não coincidem!")
			return
		}

		const ok = await signUp(name, email, password)
		if (!ok) {
			showMessage("Dados inválidos — preencha todos os campos e use senha >= 4 caracteres")
			return
		}
		showMessage("Cadastro realizado com sucesso!")
		setTimeout(() => {
			navigation.navigate("Login" as never)
		}, 1500)
	}

	function handlePasswordChange(text: string) {
		const isDeleting = text.length < displayPassword.length

		if (isDeleting) {
			setPassword(password.slice(0, text.length))
			setDisplayPassword(text.length > 0 ? "•".repeat(text.length - 1) + password.slice(text.length - 1, text.length) : "")
		} else {
			const newChar = text.slice(-1)
			const newPassword = password + newChar
			setPassword(newPassword)
			setDisplayPassword("•".repeat(newPassword.length - 1) + newChar)
		}

		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}

		if (text.length > 0) {
			timeoutRef.current = setTimeout(() => {
				setDisplayPassword("•".repeat(password.length + (isDeleting ? 0 : 1)))
			}, 800)
		}
	}
	function handleConfirmPasswordChange(text: string) {
		const isDeleting = text.length < displayConfirmPassword.length

		if (isDeleting) {
			setConfirmPassword(confirmPassword.slice(0, text.length))
			setDisplayConfirmPassword(text.length > 0 ? "•".repeat(text.length - 1) + confirmPassword.slice(text.length - 1, text.length) : "")
		} else {
			const newChar = text.slice(-1)
			const newPassword = confirmPassword + newChar
			setConfirmPassword(newPassword)
			setDisplayConfirmPassword("•".repeat(newPassword.length - 1) + newChar)
		}

		if (confirmTimeoutRef.current) {
			clearTimeout(confirmTimeoutRef.current)
		}

		if (text.length > 0) {
			confirmTimeoutRef.current = setTimeout(() => {
				setDisplayConfirmPassword("•".repeat(confirmPassword.length + (isDeleting ? 0 : 1)))
			}, 800)
		}
	}

	React.useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
			if (confirmTimeoutRef.current) {
				clearTimeout(confirmTimeoutRef.current)
			}
		}
	}, [])

	return (
		<>
			<StatusBar barStyle="light-content" />
			<ImageBackground
				source={require("../image/background.png")}
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
							<Text style={styles.title}>Crie sua conta</Text>
							<Text style={styles.subtitle}>Informe seus dados abaixo</Text>
						</View>

						{/* Name Input */}
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Nome completo</Text>
							<View
								style={[
									styles.inputWrapper,
									focusedInput === "name" && styles.inputWrapperFocused,
								]}
							>
								<TextInput
									placeholder="Seu nome"
									placeholderTextColor="#9ca3af"
									style={styles.input}
									value={name}
									onChangeText={setName}
									onFocus={() => setFocusedInput("name")}
									onBlur={() => setFocusedInput(null)}
								/>
							</View>
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

						{/* Confirm Password Input */}
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Confirmar senha</Text>
							<View
								style={[
									styles.inputWrapper,
									focusedInput === "confirmPassword" && styles.inputWrapperFocused,
									confirmPassword.length > 0 && password !== confirmPassword && styles.inputWrapperError,
								]}
							>
								<TextInput
									placeholder="••••••••"
									placeholderTextColor="#9ca3af"
									style={styles.input}
									value={displayConfirmPassword}
									onChangeText={handleConfirmPasswordChange}
									onFocus={() => setFocusedInput("confirmPassword")}
									onBlur={() => setFocusedInput(null)}
									autoCapitalize="none"
									autoCorrect={false}
								/>
							</View>
							{confirmPassword.length > 0 && password !== confirmPassword && (
								<Text style={styles.errorText}>As senhas não coincidem</Text>
							)}
							{confirmPassword.length > 0 && password === confirmPassword && (
								<Text style={styles.successText}>✓ Senhas coincidem</Text>
							)}
						</View>

						{/* Register Button */}
						<TouchableOpacity
							style={styles.button}
							onPress={onRegister}
							activeOpacity={0.8}
						>
							<Text style={styles.buttonText}>Cadastrar</Text>
						</TouchableOpacity>

						{/* Divider */}
						<View style={styles.divider}>
							<View style={styles.dividerLine} />
							<Text style={styles.dividerText}>ou</Text>
							<View style={styles.dividerLine} />
						</View>

						{/* Back to Login */}
						<TouchableOpacity onPress={() => navigation.goBack()}>
							<Text style={styles.link}>Voltar ao login</Text>
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
		borderColor: "#10b981",
		backgroundColor: "#ffffff",
	},
	input: {
		padding: 14,
		fontSize: 15,
		color: "#111827",
	},
	button: {
		backgroundColor: "#10b981",
		padding: 16,
		borderRadius: 12,
		alignItems: "center",
		marginTop: 6,
		shadowColor: "#10b981",
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
		textAlign: "center",
		fontSize: 14,
		fontWeight: "600",
	},
	inputWrapperError: {
		borderColor: "#ef4444",
		backgroundColor: "#fef2f2",
	},
	errorText: {
		fontSize: 12,
		color: "#ef4444",
		marginTop: 4,
		marginLeft: 4,
	},
	successText: {
		fontSize: 12,
		color: "#10b981",
		marginTop: 4,
		marginLeft: 4,
	},
})