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
	ScrollView,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import AuthContext from "../../contexts/AuthContext"

export default function RegisterOngPage() {
	const { registerOng } = React.useContext(AuthContext)
	const navigation = useNavigation()

	const [name, setName] = React.useState("")
	const [email, setEmail] = React.useState("")
	const [street, setStreet] = React.useState("")
	const [number, setNumber] = React.useState("")
	const [neighborhood, setNeighborhood] = React.useState("")
	const [city, setCity] = React.useState("")
	const [stateUf, setStateUf] = React.useState("")
	const [zip, setZip] = React.useState("")
	const [pixKey, setPixKey] = React.useState("")
	const [whatsapp, setWhatsapp] = React.useState("")
	const [password, setPassword] = React.useState("")
	const [displayPassword, setDisplayPassword] = React.useState("")
	const [confirmPassword, setConfirmPassword] = React.useState("")
	const [displayConfirmPassword, setDisplayConfirmPassword] = React.useState("")

	const [focusedInput, setFocusedInput] = React.useState<string | null>(null)
	const passwordTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)
	const confirmPasswordTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

	const showMessage = (message: string) => {
		if (Platform.OS === "android") {
			ToastAndroid.show(message, ToastAndroid.SHORT)
		} else {
			Alert.alert("Aviso", message)
		}
	}

	function formatWhatsapp(value: string) {
		const digits = value.replace(/\D/g, "")
		let localDigits = digits.startsWith("55") ? digits.slice(2) : digits
		localDigits = localDigits.slice(0, 11)

		if (localDigits.length === 0) return ""

		if (localDigits.length <= 2) {
			return `+55 (${localDigits}`
		}

		if (localDigits.length <= 7) {
			return `+55 (${localDigits.slice(0, 2)}) ${localDigits.slice(2)}`
		}

		return `+55 (${localDigits.slice(0, 2)}) ${localDigits.slice(2, 7)}-${localDigits.slice(7)}`
	}

	function handleWhatsappChange(value: string) {
		setWhatsapp(formatWhatsapp(value))
	}

	function formatCep(value: string) {
		const digits = value.replace(/\D/g, "").slice(0, 8)
		if (digits.length <= 5) return digits
		return `${digits.slice(0, 5)}-${digits.slice(5)}`
	}

	function handleCepChange(value: string) {
		setZip(formatCep(value))
	}

	function handleStateChange(value: string) {
		const letters = value.replace(/[^A-Za-z]/g, "").slice(0, 2)
		setStateUf(letters.toUpperCase())
	}

	function handlePasswordChange(text: string) {
		const isDeleting = text.length < displayPassword.length

		if (isDeleting) {
			setPassword(password.slice(0, text.length))
			setDisplayPassword(
				text.length > 0
					? "•".repeat(text.length - 1) + password.slice(text.length - 1, text.length)
					: ""
			)
		} else {
			const newChar = text.slice(-1)
			const newPassword = password + newChar
			setPassword(newPassword)
			setDisplayPassword("•".repeat(newPassword.length - 1) + newChar)
		}

		if (passwordTimeoutRef.current) {
			clearTimeout(passwordTimeoutRef.current)
		}

		if (text.length > 0) {
			passwordTimeoutRef.current = setTimeout(() => {
				setDisplayPassword("•".repeat(password.length + (isDeleting ? 0 : 1)))
			}, 800)
		}
	}

	function handleConfirmPasswordChange(text: string) {
		const isDeleting = text.length < displayConfirmPassword.length

		if (isDeleting) {
			setConfirmPassword(confirmPassword.slice(0, text.length))
			setDisplayConfirmPassword(
				text.length > 0
					? "•".repeat(text.length - 1) + confirmPassword.slice(text.length - 1, text.length)
					: ""
			)
		} else {
			const newChar = text.slice(-1)
			const newPassword = confirmPassword + newChar
			setConfirmPassword(newPassword)
			setDisplayConfirmPassword("•".repeat(newPassword.length - 1) + newChar)
		}

		if (confirmPasswordTimeoutRef.current) {
			clearTimeout(confirmPasswordTimeoutRef.current)
		}

		if (text.length > 0) {
			confirmPasswordTimeoutRef.current = setTimeout(() => {
				setDisplayConfirmPassword("•".repeat(confirmPassword.length + (isDeleting ? 0 : 1)))
			}, 800)
		}
	}

	async function onRegisterOng() {
		const trimmedEmail = email.trim()
		const trimmedStreet = street.trim()
		const trimmedNumber = number.trim()
		const trimmedNeighborhood = neighborhood.trim()
		const trimmedCity = city.trim()
		const trimmedState = stateUf.trim()
		const trimmedZip = zip.trim()
		const trimmedPix = pixKey.trim()
		const trimmedWhatsapp = whatsapp.trim()
		const normalizedState = trimmedState.toUpperCase()

		if (
			!name ||
			!trimmedEmail ||
			!trimmedStreet ||
			!trimmedNumber ||
			!trimmedNeighborhood ||
			!trimmedCity ||
			!normalizedState ||
			!trimmedZip ||
			!trimmedPix ||
			!trimmedWhatsapp ||
			!password ||
			!confirmPassword
		) {
			showMessage("Preencha todos os campos antes de continuar")
			return
		}

		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailPattern.test(trimmedEmail)) {
			showMessage("Informe um e-mail válido")
			return
		}

		if (password.trim().length < 4) {
			showMessage("Senha deve ter ao menos 4 caracteres")
			return
		}

		if (password !== confirmPassword) {
			showMessage("As senhas não coincidem!")
			return
		}

		const ok = await registerOng({
			name,
			email: trimmedEmail,
			address: {
				street: trimmedStreet,
				number: trimmedNumber,
				neighborhood: trimmedNeighborhood,
				city: trimmedCity,
				state: normalizedState,
				zip: trimmedZip,
			},
			pixKey: trimmedPix,
			whatsapp: trimmedWhatsapp,
			password,
		})

		if (!ok) {
			showMessage("Verifique os dados informados e tente novamente")
			return
		}

		showMessage("ONG cadastrada com sucesso!")
		setName("")
		setEmail("")
		setStreet("")
		setNumber("")
		setNeighborhood("")
		setCity("")
		setStateUf("")
		setZip("")
		setPixKey("")
		setWhatsapp("")
		if (passwordTimeoutRef.current) {
			clearTimeout(passwordTimeoutRef.current)
			passwordTimeoutRef.current = null
		}
		if (confirmPasswordTimeoutRef.current) {
			clearTimeout(confirmPasswordTimeoutRef.current)
			confirmPasswordTimeoutRef.current = null
		}
		setPassword("")
		setDisplayPassword("")
		setConfirmPassword("")
		setDisplayConfirmPassword("")
		setTimeout(() => {
			navigation.navigate("Login" as never)
		}, 1500)
	}

	React.useEffect(() => {
		return () => {
			if (passwordTimeoutRef.current) {
				clearTimeout(passwordTimeoutRef.current)
			}
			if (confirmPasswordTimeoutRef.current) {
				clearTimeout(confirmPasswordTimeoutRef.current)
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
						<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
							<View style={styles.header}>
								<Text style={styles.title}>Cadastro de ONG</Text>
								<Text style={styles.subtitle}>
									Informe os dados oficiais da organização para facilitar o contato
								</Text>
							</View>

							<View style={styles.infoBanner}>
								<Text style={styles.infoBannerText}>
									Os dados serão utilizados para validar sua ONG e conectar apoiadores.
								</Text>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Nome da ONG</Text>
								<View
									style={[
										styles.inputWrapper,
										focusedInput === "name" && styles.inputWrapperFocused,
									]}
								>
									<TextInput
										placeholder="Ex: Instituto Esperança"
										placeholderTextColor="#9ca3af"
										style={styles.input}
										value={name}
										onChangeText={setName}
										onFocus={() => setFocusedInput("name")}
										onBlur={() => setFocusedInput(null)}
										autoCapitalize="words"
									/>
								</View>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>E-mail</Text>
								<View
									style={[
										styles.inputWrapper,
										focusedInput === "email" && styles.inputWrapperFocused,
									]}
								>
									<TextInput
										placeholder="contato@ong.org.br"
										placeholderTextColor="#9ca3af"
										style={styles.input}
										keyboardType="email-address"
										autoCapitalize="none"
										value={email}
										onChangeText={setEmail}
										onFocus={() => setFocusedInput("email")}
										onBlur={() => setFocusedInput(null)}
									/>
								</View>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Rua / Logradouro</Text>
								<View
									style={[
										styles.inputWrapper,
										focusedInput === "street" && styles.inputWrapperFocused,
									]}
								>
									<TextInput
										placeholder="Av. Paulista"
										placeholderTextColor="#9ca3af"
										style={styles.input}
										value={street}
										onChangeText={setStreet}
										onFocus={() => setFocusedInput("street")}
										onBlur={() => setFocusedInput(null)}
										autoCapitalize="words"
									/>
								</View>
							</View>

							<View style={styles.inputRow}>
								<View style={[styles.inputContainer, styles.inputRowItemSmall]}>
									<Text style={styles.label}>Número</Text>
									<View
										style={[
											styles.inputWrapper,
											focusedInput === "number" && styles.inputWrapperFocused,
										]}
									>
										<TextInput
											placeholder="123"
											placeholderTextColor="#9ca3af"
											style={styles.input}
											value={number}
											onChangeText={setNumber}
											onFocus={() => setFocusedInput("number")}
											onBlur={() => setFocusedInput(null)}
											autoCapitalize="none"
											keyboardType="numeric"
											maxLength={6}
									/>
								</View>
							</View>

								<View style={[styles.inputContainer, styles.inputRowItemWide]}>
									<Text style={styles.label}>Bairro</Text>
									<View
										style={[
											styles.inputWrapper,
											focusedInput === "neighborhood" && styles.inputWrapperFocused,
										]}
									>
										<TextInput
											placeholder="Bela Vista"
											placeholderTextColor="#9ca3af"
											style={styles.input}
											value={neighborhood}
											onChangeText={setNeighborhood}
											onFocus={() => setFocusedInput("neighborhood")}
											onBlur={() => setFocusedInput(null)}
											autoCapitalize="words"
									/>
								</View>
							</View>
							</View>

							<View style={styles.inputRow}>
								<View style={[styles.inputContainer, styles.inputRowItemWide]}>
									<Text style={styles.label}>Cidade</Text>
									<View
										style={[
											styles.inputWrapper,
											focusedInput === "city" && styles.inputWrapperFocused,
										]}
									>
										<TextInput
											placeholder="São Paulo"
											placeholderTextColor="#9ca3af"
											style={styles.input}
											value={city}
											onChangeText={setCity}
											onFocus={() => setFocusedInput("city")}
											onBlur={() => setFocusedInput(null)}
											autoCapitalize="words"
									/>
								</View>
							</View>

								<View style={[styles.inputContainer, styles.inputRowItemSmall]}>
									<Text style={styles.label}>Estado (UF)</Text>
									<View
										style={[
											styles.inputWrapper,
											focusedInput === "state" && styles.inputWrapperFocused,
										]}
									>
										<TextInput
											placeholder="SP"
											placeholderTextColor="#9ca3af"
											style={styles.input}
											value={stateUf}
											onChangeText={handleStateChange}
											onFocus={() => setFocusedInput("state")}
											onBlur={() => setFocusedInput(null)}
											autoCapitalize="characters"
											maxLength={2}
									/>
								</View>
							</View>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>CEP</Text>
								<View
									style={[
										styles.inputWrapper,
										focusedInput === "zip" && styles.inputWrapperFocused,
									]}
								>
									<TextInput
										placeholder="00000-000"
										placeholderTextColor="#9ca3af"
										style={styles.input}
										keyboardType="numeric"
										value={zip}
										onChangeText={handleCepChange}
										onFocus={() => setFocusedInput("zip")}
										onBlur={() => setFocusedInput(null)}
										maxLength={9}
								/>
								</View>
							</View>

							<View style={styles.inputContainer}>
								<Text style={styles.label}>Senha de acesso</Text>
								<View
									style={[
										styles.inputWrapper,
										focusedInput === "password" && styles.inputWrapperFocused,
									]}
								>
									<TextInput
										placeholder="Crie uma senha"
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
										placeholder="Repita a senha"
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

							<View style={styles.inputRow}>
								<View style={[styles.inputContainer, styles.inputRowItem]}>
									<Text style={styles.label}>Chave Pix</Text>
									<View
										style={[
											styles.inputWrapper,
											focusedInput === "pixKey" && styles.inputWrapperFocused,
										]}
									>
										<TextInput
											placeholder="E-mail, CPF/CNPJ ou chave aleatória"
											placeholderTextColor="#9ca3af"
											style={styles.input}
											value={pixKey}
											onChangeText={setPixKey}
											onFocus={() => setFocusedInput("pixKey")}
											onBlur={() => setFocusedInput(null)}
											autoCapitalize="none"
										/>
									</View>
								</View>

								<View style={[styles.inputContainer, styles.inputRowItem]}>
									<Text style={styles.label}>WhatsApp</Text>
									<View
										style={[
											styles.inputWrapper,
											focusedInput === "whatsapp" && styles.inputWrapperFocused,
										]}
									>
										<TextInput
											placeholder="(11) 99999-9999"
											placeholderTextColor="#9ca3af"
											style={styles.input}
											keyboardType="phone-pad"
											value={whatsapp}
											onChangeText={handleWhatsappChange}
											onFocus={() => setFocusedInput("whatsapp")}
											onBlur={() => setFocusedInput(null)}
										/>
									</View>
								</View>
							</View>

							<TouchableOpacity style={styles.button} onPress={onRegisterOng} activeOpacity={0.85}>
								<Text style={styles.buttonText}>Cadastrar ONG</Text>
							</TouchableOpacity>

							<View style={styles.divider}>
								<View style={styles.dividerLine} />
								<Text style={styles.dividerText}>ou</Text>
								<View style={styles.dividerLine} />
							</View>

							<TouchableOpacity onPress={() => navigation.goBack()}>
								<Text style={styles.link}>Voltar ao login</Text>
							</TouchableOpacity>
						</ScrollView>
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
		maxWidth: 480,
		padding: 32,
		borderRadius: 24,
		backgroundColor: "rgba(255, 255, 255, 0.97)",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 10 },
		shadowOpacity: 0.15,
		shadowRadius: 20,
		elevation: 10,
		maxHeight: "90%",
	},
	scrollContent: {
		paddingBottom: 16,
	},
	header: {
		marginBottom: 24,
		alignItems: "center",
	},
	title: {
		fontSize: 30,
		fontWeight: "700",
		color: "#111827",
		marginBottom: 8,
		letterSpacing: -0.5,
	},
	subtitle: {
		fontSize: 15,
		color: "#6b7280",
		textAlign: "center",
	},
	infoBanner: {
		borderWidth: 1,
		borderColor: "#bfdbfe",
		backgroundColor: "#dbeafe",
		padding: 14,
		borderRadius: 16,
		marginBottom: 24,
	},
	infoBannerText: {
		fontSize: 13,
		color: "#1d4ed8",
		textAlign: "center",
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
	inputWrapperError: {
		borderColor: "#ef4444",
		backgroundColor: "#fef2f2",
	},
	inputRow: {
		flexDirection: "row",
		gap: 16,
		flexWrap: "wrap",
	},
	inputRowItem: {
		flex: 1,
	},
	inputRowItemWide: {
		flex: 1,
		minWidth: 200,
	},
	inputRowItemSmall: {
		flex: 1,
		maxWidth: 140,
		minWidth: 100,
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
		textAlign: "center",
		fontSize: 14,
		fontWeight: "600",
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
