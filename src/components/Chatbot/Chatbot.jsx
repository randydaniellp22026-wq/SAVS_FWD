import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
// import { GoogleGenerativeAI } from "@google/generative-ai"; // No longer using Gemini SDK
import './Chatbot.css';

// Clave de API desde el entorno
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [vehicles, setVehicles] = useState([]);
    const [whatsappNumber, setWhatsappNumber] = useState('+506 6476-9091');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    id: 1,
                    type: 'bot',
                    text: '👋 ¡Hola! Bienvenido a IMPORTADORA SAVS. Soy tu asistente virtual impulsado por IA. ¿En qué puedo ayudarte hoy?'
                }
            ]);
        }
    }, [isOpen]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        fetch('http://localhost:5000/vehicles')
            .then(res => res.json())
            .then(data => setVehicles(data))
            .catch(err => console.error("Error fetching vehicles:", err));

        fetch('http://localhost:5000/settings')
            .then(res => res.json())
            .then(data => {
                if (data.company?.whatsapp) setWhatsappNumber(data.company.whatsapp);
            })
            .catch(err => console.error("Error fetching settings:", err));
    }, []);

    const generateAIResponse = async (userText, history) => {
        setIsTyping(true);
        setError(null);

        try {
            // Usamos Groq Cloud: Extremadamente rápido y con plan gratuito generoso.
            const url = "https://api.groq.com/openai/v1/chat/completions";
            
            const inventoryContext = vehicles.length > 0 
                ? vehicles.map(v => `- ${v.name} (${v.year}) [ID: ${v.id}]: ₡${v.price.toLocaleString()}.`).join('\n')
                : "Consultar inventario en la web.";

            const systemPrompt = `Eres el asistente experto de IMPORTADORA SAVS, Costa Rica. 
            
            REGLAS CRÍTICAS:
            1. Solo responde preguntas relacionadas con IMPORTADORA SAVS (venta de autos, inventario, financiamiento, trámites, etc.).
            2. Si el usuario pregunta algo fuera de contexto (chistes, temas personales, política, etc.), declina amablemente indicando que eres un asistente especializado en la importadora.
            3. Si el usuario pregunta por un auto del inventario, DEBES dar el link usando este formato: [Ver detalles del auto](/inventory/details/ID).
            4. Si no sabes la respuesta, el usuario pide hablar con un humano, o se llega a una conclusión/acuerdo de interés, DEBES invitar al usuario a contactar por WhatsApp.
            5. Responde siempre de forma amable y profesional.
            
            INVENTARIO DISPONIBLE:
            ${inventoryContext}
            
            WhatsApp de la empresa: ${whatsappNumber}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userText }
                    ],
                    temperature: 0.7,
                    max_tokens: 1024
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            if (!data.choices || data.choices.length === 0) {
                throw new Error("No se recibió respuesta de la IA.");
            }

            const text = data.choices[0].message.content;

            if (!text) {
                throw new Error("No se recibió respuesta de la IA.");
            }
            
            const showWhatsapp = text.toLowerCase().includes('whatsapp') || 
                               text.toLowerCase().includes('asesor') || 
                               text.toLowerCase().includes('contactar') ||
                               text.toLowerCase().includes('conclusión') ||
                               text.toLowerCase().includes('gracias') ||
                               text.toLowerCase().includes('terminar');

            setMessages(prev => [...prev, { 
                id: Date.now(), 
                type: 'bot', 
                text: text,
                whatsapp: showWhatsapp ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}` : null
            }]);
        } catch (err) {
            console.error("AI Error:", err);
            setMessages(prev => [...prev, {
                id: Date.now(),
                type: 'bot',
                text: `❌ Error: ${err.message}`
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const userMsg = { id: Date.now(), type: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        const currentInput = input;
        setInput('');
        
        await generateAIResponse(currentInput, [...messages, userMsg]);
    };

    const handleOptionClick = (option) => {
        if (option.value === 'mostrar_catalogo') {
            window.location.href = '/inventory';
            return;
        }
        const userMsg = { id: Date.now(), type: 'user', text: option.label };
        setMessages(prev => [...prev, userMsg]);
        generateAIResponse(option.value, [...messages, userMsg]);
    };

    return (
        <div className={`chatbot-wrapper ${isOpen ? 'is-open' : ''}`}>
            <button className="chatbot-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
                {!isOpen && <span className="notification-badge">AI</span>}
            </button>

            <div className="chatbot-window">
                <div className="chatbot-header">
                    <div className="bot-info">
                        <div className="bot-avatar"><Bot size={20} color="#000" /></div>
                        <div>
                            <h4>SAVS AI Assistant</h4>
                            <span className="online-status">IA SAVS (Impulsada por Groq)</span>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="action-btn" onClick={() => setMessages([])}><RefreshCw size={16} /></button>
                        <button className="action-btn" onClick={() => setIsOpen(false)}><X size={18} /></button>
                    </div>
                </div>

                <div className="messages-container">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message-row ${msg.type}`}>
                            {msg.type === 'bot' && <div className="avatar-small"><Bot size={14} color="#eab308" /></div>}
                            <div className="message-content">
                                <div className="text-wrapper">
                                    {msg.text.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                                </div>
                                {msg.whatsapp && (
                                    <a href={msg.whatsapp} target="_blank" rel="noreferrer" className="whatsapp-call-btn">
                                        <ExternalLink size={14} /> Contactar Asesor
                                    </a>
                                )}
                                {msg.options && (
                                    <div className="options-container">
                                        {msg.options.map((opt, idx) => (
                                            <button key={idx} className="option-btn" onClick={() => handleOptionClick(opt)}>{opt.label}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="message-row bot typing">
                            <div className="avatar-small"><Bot size={14} color="#eab308" /></div>
                            <div className="message-content typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chatbot-input-form" onSubmit={handleSendMessage}>
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isTyping ? "Esperando respuesta..." : "Escribe tu consulta..."}
                        disabled={isTyping}
                    />
                    <button type="submit" disabled={isTyping || !input.trim()}><Send size={18} /></button>
                </form>
            </div>
        </div>
    );
};

export default Chatbot;
