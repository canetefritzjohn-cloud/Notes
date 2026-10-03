import "./globals.css";

export const metadata = {
  title: "My Notes",
  description: "A simple space to capture and manage your notes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
