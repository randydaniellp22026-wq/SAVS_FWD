/**
 * @file ErrorBoundary.test.jsx
 * @description Prueba unitaria básica para el componente ErrorBoundary.
 * Simula un componente que lanza un error y verifica que se renderice el fallback.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../core/ErrorBoundary';

// Componente de prueba que lanza un error de forma deliberada
const ComponenteConError = () => {
  throw new Error('Error simulado en componente hijo');
};

describe('ErrorBoundary Component', () => {
  // Evitar que React imprima el error esperado en la consola durante las pruebas
  let consoleErrorSpy;
  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it('debe renderizar los componentes hijos si no hay errores', () => {
    render(
      <ErrorBoundary>
        <div data-testid="contenido-correcto">Contenido Correcto</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId('contenido-correcto')).toBeInTheDocument();
    expect(screen.getByTestId('contenido-correcto')).toHaveTextContent('Contenido Correcto');
  });

  it('debe renderizar el UI de fallback por defecto cuando ocurre un error', () => {
    render(
      <ErrorBoundary>
        <ComponenteConError />
      </ErrorBoundary>
    );

    // Verifica que se muestre el texto de DefaultErrorUI
    expect(screen.getByText('¡Algo salió mal!')).toBeInTheDocument();
  });

  it('debe renderizar un fallback personalizado cuando se le pasa por props', () => {
    const FallbackPersonalizado = <div data-testid="fallback-custom">Error Personalizado</div>;

    render(
      <ErrorBoundary fallback={FallbackPersonalizado}>
        <ComponenteConError />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('fallback-custom')).toBeInTheDocument();
    expect(screen.getByTestId('fallback-custom')).toHaveTextContent('Error Personalizado');
  });
});
