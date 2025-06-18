import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material';
import Login from './components/Login';


function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Inventory Management
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4, flexGrow: 1 }}>
        <Box sx={{ minHeight: 'calc(100vh - 64px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/products" element={<div>Product List Page (To be implemented)</div>} />
            <Route path="/add-product" element={<div>Add Product Page (To be implemented)</div>} />
            <Route path="/" element={<div>Home (Redirects to Login)</div>} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App;