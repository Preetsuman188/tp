import { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Container,
    Alert,
    InputAdornment,
    IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Lock, Person } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const response = await api.login(username, password);
            login(response.user, response.token);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Invalid username or password');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                py: 4
            }}
        >
            <Container maxWidth="xs">
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight={800} color="white" gutterBottom>
                        TPSODL
                    </Typography>
                    <Typography variant="body1" color="rgba(255,255,255,0.7)">
                        Data Request Management System
                    </Typography>
                </Box>

                <Card sx={{ borderRadius: 4, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
                            Login
                        </Typography>

                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Username"
                                variant="outlined"
                                margin="normal"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                variant="outlined"
                                margin="normal"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={isSubmitting}
                                sx={{
                                    mt: 4,
                                    py: 1.5,
                                    bgcolor: '#0f4c81',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    '&:hover': { bgcolor: '#0a3d6a' }
                                }}
                            >
                                {isSubmitting ? 'Logging in...' : 'Sign In'}
                            </Button>
                        </form>

                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                Default: admin / admin123
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}
