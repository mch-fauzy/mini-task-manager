import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { server } from './server';

// jsdom has no matchMedia. Ant Design's responsive grid needs it, so stub a
// non-matching implementation for component tests.
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    }),
});

// jsdom throws "Not implemented" when getComputedStyle is given a pseudo-element,
// which AntD's scrollbar measurement does (Modal). Delegate the normal case to
// jsdom and return an empty declaration for pseudo-element queries.
const realGetComputedStyle = window.getComputedStyle.bind(window);
window.getComputedStyle = function getComputedStyleStub(
    element: Element,
    pseudoElement?: string | null,
): CSSStyleDeclaration {
    if (pseudoElement) {
        return { width: '', height: '', getPropertyValue: () => '' } as unknown as CSSStyleDeclaration;
    }
    return realGetComputedStyle(element);
};

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
