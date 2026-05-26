import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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
  const imageInputRef = useRef(null); // input file oculto
  const [pendingImage, setPendingImage] = useState(null); // imagen lista para enviar
  const [imagePreview, setImagePreview] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ── Manejo de imagen adjunta ────────────────────────────────────────────
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError('La imagen es muy grande. Máximo 10 MB.');
      return;
    }
    setPendingImage(file);
    setImagePreview(URL.createObjectURL(file));
    setError(null);
  };

  const removePendingImage = () => {
    setPendingImage(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          type: 'bot',
          text: '👋 ¡Hola! Bienvenido a IMPORTADORA SAVS. Soy tu asistente virtual impulsado por IA. ¿En qué puedo ayudarte hoy?',
        },
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    api
      .get('/vehicles')
      .then((res) => setVehicles(res.data))
      .catch((err) => console.error('Error fetching vehicles:', err));

    api
      .get('/settings')
      .then((res) => {
        if (res.data.company?.whatsapp) setWhatsappNumber(res.data.company.whatsapp);
      })
      .catch((err) => console.error('Error fetching settings:', err));
  }, []);

  const generateAIResponse = async (userText, history) => {
    setIsTyping(true);
    setError(null);

    try {
      let response;

      if (pendingImage) {
        const formData = new FormData();
        formData.append('message', userText || 'Describe esta imagen');
        formData.append('image', pendingImage);
        // import perezoso del servicio de chat
        const { chatService } = await import('../../services/api');
        response = await chatService.sendWithImage(formData);
      } else {
        const { chatService } = await import('../../services/api');
        response = await chatService.sendText(userText);
      }

      const data = response;
      const text = data.reply;
      const whatsappNum = data.whatsapp || whatsappNumber;

      const showWhatsapp =
        data.showWhatsapp ||
        text.toLowerCase().includes('whatsapp') ||
        text.toLowerCase().includes('asesor');

      const showCatalog = data.showCatalog;

      // Si venia imagen, limpiar despues de respuesta exitosa
      if (pendingImage) removePendingImage();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'bot',
          text: text,
          whatsapp: showWhatsapp ? `https://wa.me/${whatsappNum.replace(/\D/g, '')}` : null,
          internalLink: showCatalog
            ? { url: '/inventory', label: 'Explorar Catálogo Completo' }
            : null,
        },
      ]);
    } catch (err) {
      console.error('AI Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'bot',
          text: `❌ Error: ${err.response?.data?.error || err.message}`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() && !pendingImage) return;
    if (isTyping) return;

    const userText = input.trim();
    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: userText || (pendingImage ? '📎 Imagen adjunta' : ''),
      image: imagePreview || null,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    await generateAIResponse(userText, [...messages, userMsg]);
  };

  const handleOptionClick = (option) => {
    if (option.value === 'mostrar_catalogo') {
      window.location.href = '/inventory';
      return;
    }
    const userMsg = { id: Date.now(), type: 'user', text: option.label };
    setMessages((prev) => [...prev, userMsg]);
    generateAIResponse(option.value, [...messages, userMsg]);
  };

    return (
        <div className={`chatbot-wrapper ${isOpen ? 'is-open' : ''}`}>
            <button
                className="chatbot-toggle"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls="chatbot-window"
                aria-label={isOpen ? 'Cerrar asistente virtual' : 'Abrir asistente virtual SAVS'}
            >
                {isOpen ? <X size={24} aria-hidden="true" /> : <MessageSquare size={24} aria-hidden="true" />}
                {!isOpen && <span className="notification-badge" aria-hidden="true">AI</span>}
            </button>

            <div
                id="chatbot-window"
                className="chatbot-window"
                role="dialog"
                aria-modal="true"
                aria-label="Asistente virtual SAVS AI"
            >
                <div className="chatbot-header">
                    <div className="bot-info">
                        <div className="bot-avatar"><Bot size={20} color="#000" aria-hidden="true" /></div>
                        <div>
                            <h4>SAVS AI Assistant</h4>
                            <span className="online-status">IA SAVS (Impulsada por Groq)</span>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="action-btn" onClick={() => setMessages([])} aria-label="Limpiar conversación"><RefreshCw size={16} aria-hidden="true" /></button>
                        <button className="action-btn" onClick={() => setIsOpen(false)} aria-label="Cerrar chat"><X size={18} aria-hidden="true" /></button>
                    </div>
                </div>

                {/* Input de archivo oculto */}
                <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleImageSelect}
                    className="chat-file-input-hidden"
                    aria-hidden="true"
                    tabIndex={-1}
                />

                <div className="messages-container" aria-live="polite" aria-label="Mensajes del chat" role="log">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`message-row ${msg.type}`}>
                            {msg.type === 'bot' && <div className="avatar-small"><Bot size={14} color="#eab308" /></div>}
                            <div className="message-content">
                                {msg.image && (
                                    <div className="chat-msg-image">
                                        <img src={msg.image} alt="Adjunto" />
                                    </div>
                                )}
                                <div className="text-wrapper">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
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
              )}
              <div className="message-content">
                {msg.image && (
                  <div className="chat-msg-image">
                    <img src={msg.image} alt="Adjunto" />
                  </div>
                )}
                <div className="text-wrapper">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                </div>
                {msg.internalLink && (
                  <button
                    className="internal-link-btn"
                    onClick={() => (window.location.href = msg.internalLink.url)}
                  >
                    <ExternalLink size={14} /> {msg.internalLink.label}
                  </button>
                )}
                {msg.whatsapp && (
                  <a
                    href={msg.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="whatsapp-call-btn"
                  >
                    <ExternalLink size={14} /> Contactar Asesor
                  </a>
                )}
                {msg.options && (
                  <div className="options-container">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        className="option-btn"
                        onClick={() => handleOptionClick(opt)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message-row bot typing">
              <div className="avatar-small">
                <Bot size={14} color="#eab308" />
              </div>
              <div className="message-content typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chatbot-input-form" onSubmit={handleSendMessage}>
          {/* Miniatura de imagen pendiente */}
          {imagePreview && (
            <div className="chat-pending-image">
              <img src={imagePreview} alt="pendiente" />
              <button type="button" className="chat-pending-remove" onClick={removePendingImage}>
                <X size={12} />
              </button>
            </div>
          )}

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isTyping ? 'Analizando imagen…' : 'Escribe tu consulta o adjunta una foto…'
            }
            disabled={isTyping}
          />
          {/* Botón adjuntar imagen */}
          <button
            type="button"
            className="chat-attach-btn"
            onClick={() => imageInputRef.current?.click()}
            disabled={isTyping}
            title="Adjuntar imagen"
          >
            <ImageIcon size={18} />
          </button>
          <button type="submit" disabled={isTyping || (!input.trim() && !pendingImage)}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
