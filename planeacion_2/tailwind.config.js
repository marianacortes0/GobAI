/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nodo: {
          entidad: '#3B82F6',
          proveedor: '#06B6D4',
          contrato: '#A855F7',
          persona: '#8B5CF6',
          consorcio: '#10B981',
          sancion: '#EF4444',
          pep: '#F59E0B',
        },
      },
    },
  },
  plugins: [],
};
