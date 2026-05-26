/**
 * ErrorBoundary — Componente de clase que captura errores en el árbol de React.
 * Soporta fallback personalizado vía props y reseteo de estado.
 * Registra errores en consola (extensible a Sentry u otro servicio).
 * @param {React.ReactNode} children — Componentes hijos a proteger.
 * @param {React.ReactNode} [fallback] — UI alternativa al detectar error.
 * @param {Function} [onError] — Callback opcional al capturar un error.
 */
import { Component } from 'react';
import DefaultErrorUI from '../ui/DefaultErrorUI';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.handleRetry = this.handleRetry.bind(this);
  }

  static getDerivedStateFromError(error) {
    // Actualiza el estado para mostrar el fallback en el próximo render
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Aquí puedes enviar a un servicio de logging (Sentry, etc.)
    console.error('ErrorBoundary capturó:', error, info);

    // Callback opcional para el componente padre
    if (typeof this.props.onError === 'function') {
      this.props.onError(error, info);
    }
  }

  /**
   * Reinicia el estado de error para permitir un reintento.
   */
  handleRetry() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      // Si se proporciona un fallback personalizado, lo usa
      if (this.props.fallback) {
        return this.props.fallback;
      }
      // Fallback predeterminado con DefaultErrorUI
      return <DefaultErrorUI error={this.state.error} onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
