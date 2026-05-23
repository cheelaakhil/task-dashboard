import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "TaskFlow — Mini Task Dashboard",
  description: "Manage your tasks efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1a1a24",
              color: "#f0f0f8",
              border: "1px solid rgba(255,255,255,0.1)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#10b981", secondary: "#0a0a0f" } },
            error:   { iconTheme: { primary: "#ef4444", secondary: "#0a0a0f" } },
          }}
        />
      </body>
    </html>
  );
}
