import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateRequest from "./pages/CreateRequest";
import RequestDetail from "./pages/RequestDetail";
import Users from "./pages/Users";
import Requests from "./pages/Requests";
import Reminders from "./pages/Reminders";
import Placeholder from "./pages/Placeholder";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import { RequestProvider } from "./context/RequestContext";
import { AuthProvider } from "./context/AuthContext";

const theme = createTheme({
  palette: {
    primary: { main: "#1b4d9b" },
    secondary: { main: "#009688" },
    background: { default: "#f6f8fb" },
  },
  shape: { borderRadius: 10 },
  typography: { fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system" },
});

function AppLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isLoginPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/request/new" element={<CreateRequest />} />
        <Route path="/request/:id" element={<RequestDetail />} />
        <Route path="/users" element={<Users />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/reminders" element={<Reminders />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <RequestProvider>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </RequestProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
