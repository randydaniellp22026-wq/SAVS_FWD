import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import './Chatbot.css';


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
        api.get('/vehicles')
            .then(res => setVehicles(res.data))
            .catch(err => console.error("Error fetching vehicles:", err));

        api.get('/settings')
            .then(res => {
                if (res.data.company?.whatsapp) setWhatsappNumber(res.data.company.whatsapp);
            })
            .catch(err => console.error("Error fetching settings:", err));
    }, []);

    const generateAIResponse = async (userText, history) => {
        setIsTyping(true);
        setError(null);

        try {
            // Ahora la lógica reside en el backend para mayor seguridad y acceso a la BD real
            const response = await api.post('/chatbot', {
                message: userText
            });

            const data = response.data;
            const text = data.reply;
            const whatsappNum = data.whatsapp || whatsappNumber;
            
            // Usamos las flags generadas por el backend con [WHATSAPP] o por fallback de texto
            const showWhatsapp = data.showWhatsapp || 
                                text.toLowerCase().includes('whatsapp') || 
                                text.toLowerCase().includes('asesor');
                                
            const showCatalog = data.showCatalog;

            setMessages(prev => [...prev, { 
                id: Date.now(), 
                type: 'bot', 
                text: text,
                whatsapp: showWhatsapp ? `https://wa.me/${whatsappNum.replace(/\D/g, '')}` : null,
                internalLink: showCatalog ? { url: '/inventory', label: 'Explorar Catálogo Completo' } : null
            }]);
        } catch (err) {
            console.error("AI Error:", err);
            setMessages(prev => [...prev, {
                id: Date.now(),
                type: 'bot',
                text: `❌ Error: ${err.response?.data?.error || err.message}`
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
                                    {msg.text.split('\n').map((line, i) => {
                                        // Simple markdown link parser [texto](url)
                                        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
                                        if (!linkRegex.test(line)) return <p key={i}>{line}</p>;
                                        
                                        linkRegex.lastIndex = 0; // reset
                                        const parts = [];
                                        let lastIndex = 0;
                                        let match;
                                        
                                        while ((match = linkRegex.exec(line)) !== null) {
                                            if (match.index > lastIndex) parts.push(line.substring(lastIndex, match.index));
                                            parts.push(
                                                <a key={`link-${i}-${match.index}`} href={match[2]} className="inline-chatbot-link">
                                                    {match[1]}
                                                </a>
                                            );
                                            lastIndex = linkRegex.lastIndex;
                                        }
                                        if (lastIndex < line.length) parts.push(line.substring(lastIndex));
                                        
                                        return <p key={i}>{parts}</p>;
                                    })}
                                </div>
                                {msg.internalLink && (
                                    <button 
                                        className="internal-link-btn" 
                                        onClick={() => window.location.href = msg.internalLink.url}
                                    >
                                        <ExternalLink size={14} /> {msg.internalLink.label}
                                    </button>
                                )}
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
