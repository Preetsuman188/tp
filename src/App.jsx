import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateRequest from "./pages/CreateRequest";
import RequestDetail from "./pages/RequestDetail";
import Navbar from "./components/Navbar";
import { RequestProvider } from "./context/RequestContext";

const theme = createTheme({
  palette: {
    primary: { main: "#1b4d9b" },
    secondary: { main: "#009688" },
    background: { default: "#f6f8fb" },
  },
  shape: { borderRadius: 10 },
  typography: { fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system" },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RequestProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/request/new" element={<CreateRequest />} />
            <Route path="/request/:id" element={<RequestDetail />} />
          </Routes>
        </BrowserRouter>
      </RequestProvider>
    </ThemeProvider>
  );
}

export default App;
