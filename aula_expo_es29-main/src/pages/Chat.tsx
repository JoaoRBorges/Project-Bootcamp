import React, { useState, useRef, useEffect } from 'react'
import { 
  View, 
  TextInput, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator 
} from 'react-native'
import ONG_DATA from '../data/ongs-rag.json'
import Constants from 'expo-constants'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Olá! 👋 Sou seu assistente virtual. Como posso ajudar você hoje com informações sobre ONGs?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const flatListRef = useRef<FlatList>(null)

  // Auto-scroll para a última mensagem
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true })
    }
  }, [messages])

  // ---- RAG AVANÇADO: Sistema inteligente de busca ----
  function getRAGContext(query: string) {
    if (!query) return { context: "", totalFound: 0 }

    const q = query.toLowerCase()
    
    // Remover palavras comuns (stop words) para melhor busca
    const stopWords = ['a', 'o', 'de', 'da', 'do', 'em', 'para', 'com', 'um', 'uma', 'e', 'é', 'no', 'na']
    const queryWords = q.split(' ').filter(w => !stopWords.includes(w) && w.length > 2)

    // Sistema de scoring avançado
    const scored = ONG_DATA.map(ong => {
      let score = 0
      const name = ong.name.toLowerCase()
      const description = ong.description.toLowerCase()
      const address = ong.address.toLowerCase()
      
      // Match exato no nome (peso alto)
      if (name === q) score += 100
      
      // Match parcial no nome
      queryWords.forEach(word => {
        if (name.includes(word)) score += 15
        if (description.includes(word)) score += 8
        if (address.includes(word)) score += 6
      })
      
      // Busca por palavras-chave específicas
      const keywords = {
        'criança': ['criança', 'infantil', 'infância', 'crianças'],
        'educação': ['educação', 'educacional', 'ensino', 'escola'],
        'saúde': ['saúde', 'médico', 'hospital', 'tratamento'],
        'ambiente': ['ambiente', 'ambiental', 'natureza', 'mata', 'flora', 'fauna'],
        'fome': ['fome', 'alimentar', 'nutrição'],
        'água': ['água', 'hídrico', 'saneamento'],
        'câncer': ['câncer', 'oncologia'],
        'social': ['social', 'cidadania', 'desenvolvimento']
      }
      
      Object.values(keywords).forEach(synonyms => {
        synonyms.forEach(syn => {
          if (q.includes(syn)) {
            if (name.includes(syn)) score += 20
            if (description.includes(syn)) score += 10
          }
        })
      })
      
      // Busca por cidade/estado
      const locations = ['são paulo', 'rio de janeiro', 'brasília', 'belo horizonte', 
                        'porto alegre', 'salvador', 'recife', 'curitiba', 'fortaleza',
                        'sp', 'rj', 'df', 'mg', 'rs', 'ba', 'pe', 'pr', 'ce']
      
      locations.forEach(loc => {
        if (q.includes(loc) && address.includes(loc)) {
          score += 25
        }
      })
      
      // Busca por tipo de atuação
      if (q.includes('ong')) score += 2
      
      return { ...ong, score }
    })

    // Filtrar e ordenar
    const filtered = scored
      .filter(o => o.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6) // Top 6 resultados

    if (filtered.length === 0) {
      return { context: "", totalFound: 0 }
    }

    // Detectar intenção da busca
    const intent = detectIntent(q)

    // Formatar contexto baseado na intenção
    const context = filtered
      .map((o, idx) => {
        const relevance = idx === 0 ? "🌟 MAIS RELEVANTE" : idx === 1 ? "⭐ MUITO RELEVANTE" : "✓ RELEVANTE"
        
        return `
[${relevance}]
🏢 Nome: ${o.name}
📍 Endereço: ${o.address}
📞 Telefone: ${o.phone}
📧 Email: ${o.email}
ℹ️ Descrição: ${o.description}
🎯 Score de Relevância: ${o.score}
        `
      })
      .join("\n" + "─".repeat(50) + "\n")

    return { 
      context, 
      totalFound: filtered.length,
      intent,
      topMatch: filtered[0]
    }
  }

  // Detectar intenção do usuário
  function detectIntent(query: string): string {
    const q = query.toLowerCase()
    
    if (q.match(/listar|todas|lista|mostre|quais/)) return 'listar'
    if (q.match(/onde|endereço|localização|fica/)) return 'localização'
    if (q.match(/telefone|contato|ligar|falar/)) return 'contato'
    if (q.match(/email|enviar|escrever/)) return 'email'
    if (q.match(/o que|sobre|faz|trabalha|atua/)) return 'informação'
    if (q.match(/ajuda|socorro|preciso|apoio/)) return 'ajuda'
    
    return 'geral'
  }

  // Gerar contexto para casos sem resultados
  function generateSuggestions(query: string): string {
    const suggestions = [
      "Você pode perguntar sobre:",
      "• ONGs por área de atuação (educação, saúde, meio ambiente, etc.)",
      "• ONGs por localização (São Paulo, Rio de Janeiro, etc.)",
      "• Contatos e endereços de ONGs específicas",
      "• Tipos de trabalho que cada ONG realiza",
      "",
      "Exemplos de perguntas:",
      "- 'Quais ONGs trabalham com crianças?'",
      "- 'Mostre ONGs de meio ambiente'",
      "- 'ONGs em São Paulo'",
      "- 'Onde fica o GRAACC?'",
      "- 'Como entrar em contato com a Fundação Abrinq?'"
    ]
    
    return suggestions.join('\n')
  }

  // ---- Enviar mensagem ----
  async function sendMessage() {
    if (!input.trim()) return
    if (loading) return

    const userMsg: Message = { 
      role: "user", 
      content: input,
      timestamp: new Date()
    }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput("")
    setLoading(true)

    const ragResult = getRAGContext(input)
    const apiKey = Constants.expoConfig?.extra?.groqApiKey

    const systemPrompt = `
Você é um assistente virtual especializado em ONGs brasileiras. Seja amigável, prestativo e objetivo.

**CONTEXTO DA BUSCA**:
- Resultados encontrados: ${ragResult.totalFound}
- Intenção detectada: ${ragResult.intent || 'geral'}
- Query original: "${input}"

**IMPORTANTE - FORMATAÇÃO DA RESPOSTA**:
- Use **negrito** para nomes de ONGs
- Use emojis apropriados: 🏢 📍 📞 📧 ✅ ❌ 💡 🎯
- Organize em tópicos quando houver múltiplas ONGs
- Seja CONCISO mas COMPLETO
- SEMPRE mencione o nome da ONG em negrito antes de dar informações sobre ela

**REGRAS DE RESPOSTA**:

1. Se NENHUMA ONG foi encontrada (totalFound = 0):
   - Informe educadamente que não encontrou resultados
   - Sugira reformular a busca ou seja mais específico
   - Ofereça exemplos de perguntas válidas
   - NÃO invente informações

2. Se 1 ONG foi encontrada:
   - Apresente as informações de forma completa e organizada
   - Inclua TODOS os dados disponíveis (nome, endereço, telefone, email, descrição)

3. Se MÚLTIPLAS ONGs foram encontradas:
   - Liste de forma organizada (use numeração ou bullets)
   - Destaque a mais relevante primeiro
   - Para cada uma, inclua: nome em negrito, descrição breve, e como entrar em contato

4. Se a pergunta for sobre LOCALIZAÇÃO:
   - Foque no endereço completo
   - Mencione a cidade e estado claramente

5. Se a pergunta for sobre CONTATO:
   - Destaque telefone e email
   - Formate o telefone de forma legível

**DADOS DISPONÍVEIS (RAG)**:
${ragResult.context || "⚠️ NENHUMA ONG ENCONTRADA"}

${ragResult.totalFound === 0 ? `
**SUGESTÕES PARA O USUÁRIO**:
${generateSuggestions(input)}
` : ''}

**VOCÊ NÃO PODE**:
- Responder sobre assuntos não relacionados a ONGs
- Inventar informações que não estão nos dados
- Dar opiniões pessoais sobre ONGs
- Responder perguntas sobre política, religião ou outros temas

Se perguntarem algo fora do contexto, responda educadamente:
"Desculpe, posso ajudar apenas com informações sobre as ONGs cadastradas. 😊"
    `

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          max_tokens: 800,
          temperature: 0.5,
          messages: [
            { role: "system", content: systemPrompt },
            ...nextMessages.slice(-6).map(m => ({ role: m.role, content: m.content }))
          ]
        })
      })

      const data = await response.json()

      if (!data.choices || !data.choices[0]) {
        throw new Error(data.error?.message || "Resposta inválida da API")
      }

      const botMsg: Message = {
        role: "assistant",
        content: data.choices[0].message.content,
        timestamp: new Date()
      }

      setMessages([...nextMessages, botMsg])
    } catch (err) {
      const errorMsg: Message = {
        role: "assistant",
        content: "❌ Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.",
        timestamp: new Date()
      }
      setMessages([...nextMessages, errorMsg])
      console.error("Erro:", err)
    }

    setLoading(false)
  }

  // Formatar timestamp
  function formatTime(date: Date) {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  // Renderizar mensagem
  function renderMessage({ item }: { item: Message }) {
    const isUser = item.role === "user"
    
    return (
      <View style={[styles.messageContainer, isUser ? styles.userContainer : styles.botContainer]}>
        <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.botBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userText : styles.botText]}>
            {item.content}
          </Text>
          <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.botTimestamp]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💬 Chat Assistente</Text>
        <Text style={styles.headerSubtitle}>ONGs & Informações • {ONG_DATA.length} ONGs cadastradas</Text>
      </View>

      {/* Lista de mensagens */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, i) => String(i)}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        renderItem={renderMessage}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Indicador de digitação */}
      {loading && (
        <View style={styles.typingIndicator}>
          <ActivityIndicator color="#0066ff" size="small" />
          <Text style={styles.typingText}>Buscando informações...</Text>
        </View>
      )}

      {/* Input de mensagem */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ex: ONGs de educação em SP"
          placeholderTextColor="#999"
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={500}
          editable={!loading}
          onSubmitEditing={sendMessage}
        />

        <TouchableOpacity 
          style={[styles.sendButton, (!input.trim() || loading) && styles.sendButtonDisabled]} 
          onPress={sendMessage}
          disabled={!input.trim() || loading}
        >
          <Text style={styles.sendButtonText}>
            {loading ? "⏳" : "📤"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5" 
  },
  
  // Header
  header: {
    backgroundColor: "#0066ff",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#e0e0e0",
    marginTop: 4,
  },

  // Messages
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  messageContainer: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  botContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: "#0066ff",
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: "#fff",
  },
  botText: {
    color: "#333",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  userTimestamp: {
    color: "rgba(255,255,255,0.7)",
    textAlign: 'right',
  },
  botTimestamp: {
    color: "#999",
  },

  // Typing indicator
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  typingText: {
    color: "#666",
    fontSize: 14,
    fontStyle: 'italic',
  },

  // Input
  inputContainer: { 
    flexDirection: "row", 
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#f9f9f9",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    fontSize: 16,
    maxHeight: 100,
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#0066ff",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#0066ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
    shadowOpacity: 0,
    elevation: 0,
  },
  sendButtonText: {
    fontSize: 20,
  }
})