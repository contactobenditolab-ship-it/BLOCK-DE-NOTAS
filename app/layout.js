export const metadata = {
  title: "Mi Lista",
  description: "Lista de tareas personal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
