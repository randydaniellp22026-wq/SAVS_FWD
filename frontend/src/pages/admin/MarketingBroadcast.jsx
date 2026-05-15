import React, { useState } from 'react';
import { Send, Mail, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import api from '../../services/api';
import Swal from 'sweetalert2';

const MarketingBroadcast = () => {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    const handleSendTest = async () => {
        if (!subject || !content) {
            Swal.fire({ ...darkSwal, title: 'Campos incompletos', icon: 'warning' });
            return;
        }

        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const myEmail = user.email || 'yosimarvv@gmail.com';

        setIsLoading(true);
        try {
            await api.post('/marketing/broadcast', { 
                subject: `[TEST] ${subject}`, 
                content, 
                testEmail: myEmail 
            });
            Swal.fire({
                title: 'Prueba Enviada',
                text: `El correo de prueba ha sido enviado a ${myEmail}`,
                icon: 'success',
                background: '#141414',
                color: '#fff'
            });
        } catch (error) {
            Swal.fire({ ...darkSwal, title: 'Error de Prueba', text: error.response?.data?.error || 'Error', icon: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendBroadcast = async () => {
        if (!subject || !content) {
            Swal.fire({
                title: 'Campos incompletos',
                text: 'Por favor escribe un asunto y el contenido del mensaje.',
                icon: 'warning',
                background: '#141414',
                color: '#fff',
                confirmButtonColor: '#eab308'
            });
            return;
        }

        const confirm = await Swal.fire({
            title: '¿Confirmar envío masivo?',
            text: 'Este correo se enviará a todos los usuarios registrados en el sistema.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, enviar ahora',
            cancelButtonText: 'Cancelar',
            background: '#141414',
            color: '#fff',
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#444'
        });

        if (confirm.isConfirmed) {
            setIsLoading(true);
            try {
                const response = await api.post('/marketing/broadcast', { subject, content });
                
                Swal.fire({
                    title: '¡Envío Exitoso!',
                    text: response.data.message,
                    icon: 'success',
                    background: '#141414',
                    color: '#fff',
                    confirmButtonColor: '#eab308'
                });

                setSubject('');
                setContent('');
            } catch (error) {
                console.error('Error enviando broadcast:', error);
                Swal.fire({
                    title: 'Error de Envío',
                    text: error.response?.data?.error || 'No se pudo procesar el envío masivo.',
                    icon: 'error',
                    background: '#141414',
                    color: '#fff'
                });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="admin-marketing-container">
            <div className="admin-header">
                <h1 className="admin-title">Email Marketing <Mail size={36} className="admin-icon-title" /></h1>
                <p className="admin-subtitle">Comunícate directamente con todos tus clientes registrados.</p>
            </div>

            <div className="marketing-grid">
                <div className="marketing-form card-base">
                    <div className="form-header">
                        <Mail className="form-icon" />
                        <h3>Redactar Nuevo Mensaje</h3>
                    </div>

                    <div className="form-group">
                        <label>Asunto del Correo</label>
                        <input 
                            type="text" 
                            placeholder="Ej: ¡Nuevos ingresos en SAVS esta semana!"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="marketing-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Contenido del Mensaje (Soporta HTML)</label>
                        <textarea 
                            placeholder="Escribe tu mensaje aquí..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="marketing-textarea"
                            rows={10}
                        ></textarea>
                    </div>

                    <div className="marketing-actions">
                        <button 
                            className="btn-preview"
                            onClick={() => setPreviewMode(!previewMode)}
                        >
                            {previewMode ? 'Editar' : 'Vista Previa'}
                        </button>
                        <button 
                            className="btn-send-test"
                            onClick={handleSendTest}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="spinner" /> : <Mail size={18} />}
                            Enviar Prueba
                        </button>
                        <button 
                            className="btn-send-broadcast"
                            onClick={handleSendBroadcast}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="spinner" /> : <Send size={18} />}
                            {isLoading ? 'Enviando...' : 'Enviar a Todos'}
                        </button>
                    </div>

                    <div className="marketing-warning">
                        <AlertTriangle size={16} />
                        <p>Atención: Esta acción no se puede deshacer y el envío es inmediato.</p>
                    </div>
                </div>

                <div className={`marketing-preview card-base ${previewMode ? 'active' : ''}`}>
                    <div className="preview-header">
                        <CheckCircle className="preview-icon" />
                        <h3>Vista Previa del Suscriptor</h3>
                    </div>
                    
                    <div className="preview-envelope">
                        <div className="preview-field">
                            <strong>De:</strong> SAVS Importadora &lt;notificaciones@savs.com&gt;
                        </div>
                        <div className="preview-field">
                            <strong>Asunto:</strong> {subject || '(Sin Asunto)'}
                        </div>
                        <div className="preview-content-box">
                            {content ? (
                                <div dangerouslySetInnerHTML={{ __html: content }}></div>
                            ) : (
                                <p className="empty-preview">Escribe algo en el editor para ver la vista previa...</p>
                            )}
                        </div>
                    </div>
                    
                    <div className="preview-footer">
                        <p>© 2024 Importadora SAVS. Todos los derechos reservados.</p>
                        <p className="unsubscribe-link">Si ya no deseas recibir estos correos, puedes cancelar tu suscripción aquí.</p>
                    </div>
                </div>
            </div>

            <style>{`
                .marketing-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                    margin-top: 2rem;
                }

                .form-header, .preview-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 1.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    padding-bottom: 1rem;
                }

                .form-icon { color: #eab308; }
                .preview-icon { color: #10b981; }

                .marketing-input, .marketing-textarea {
                    width: 100%;
                    background: rgba(0,0,0,0.2);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px;
                    padding: 0.8rem 1rem;
                    color: #fff;
                    font-family: inherit;
                    margin-top: 0.5rem;
                }

                .marketing-textarea {
                    resize: vertical;
                    min-height: 200px;
                }

                .marketing-actions {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }

                .btn-send-broadcast {
                    flex: 1;
                    background: #10b981;
                    color: #fff;
                    border: none;
                    padding: 1rem;
                    border-radius: 8px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .btn-send-broadcast:hover:not(:disabled) {
                    background: #059669;
                    transform: translateY(-2px);
                }

                .btn-send-broadcast:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .btn-send-test {
                    background: rgba(234, 179, 8, 0.1);
                    color: #eab308;
                    border: 1px solid rgba(234, 179, 8, 0.3);
                    padding: 0 1.5rem;
                    border-radius: 8px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .btn-send-test:hover:not(:disabled) {
                    background: rgba(234, 179, 8, 0.2);
                    border-color: #eab308;
                }

                .btn-preview {
                    background: rgba(255,255,255,0.05);
                    color: #fff;
                    border: 1px solid rgba(255,255,255,0.1);
                    padding: 0 1.5rem;
                    border-radius: 8px;
                    cursor: pointer;
                }

                .marketing-warning {
                    margin-top: 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 0.8rem;
                    background: rgba(234, 179, 8, 0.1);
                    border: 1px solid rgba(234, 179, 8, 0.2);
                    border-radius: 8px;
                    color: #eab308;
                    font-size: 0.85rem;
                }

                .preview-envelope {
                    background: #fff;
                    color: #333;
                    border-radius: 12px;
                    padding: 2rem;
                    min-height: 400px;
                }

                .preview-field {
                    border-bottom: 1px solid #eee;
                    padding: 0.5rem 0;
                    font-size: 0.9rem;
                    color: #666;
                }

                .preview-content-box {
                    margin-top: 2rem;
                    line-height: 1.6;
                }

                .empty-preview {
                    color: #999;
                    font-style: italic;
                    text-align: center;
                    margin-top: 4rem;
                }

                .preview-footer {
                    margin-top: 2rem;
                    text-align: center;
                    font-size: 0.75rem;
                    color: #6b7280;
                }

                .unsubscribe-link {
                    margin-top: 0.5rem;
                    text-decoration: underline;
                    cursor: pointer;
                }

                .spinner {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 1024px) {
                    .marketing-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default MarketingBroadcast;
