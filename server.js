const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Store users temporarily
const userStore = new Map();

// Phone validation
function validatePhoneNumber(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
}

// Password validation
function validatePassword(password) {
    return password && password.length >= 6;
}

// Register endpoint
app.post('/api/register', (req, res) => {
    try {
        const { phone, password } = req.body;
        
        if (!validatePhoneNumber(phone)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please enter a valid 10-digit Indian phone number' 
            });
        }
        
        if (!validatePassword(password)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters long' 
            });
        }
        
        if (userStore.has(phone)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Phone number already registered. Please login instead.' 
            });
        }
        
        const userId = 'U' + Math.floor(10000 + Math.random() * 90000);
        const newUser = {
            phone,
            userId,
            password,
            balance: 0,
            bonus: 150,
            status: 'active',
            createdAt: new Date()
        };
        
        userStore.set(phone, newUser);
        
        console.log(`✅ New user registered: ${phone} (${userId})`);
        
        res.json({ 
            success: true, 
            message: 'Registration successful! Welcome to Dream99!',
            user: {
                phone: newUser.phone,
                userId: newUser.userId,
                balance: newUser.balance,
                bonus: newUser.bonus
            }
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'Failed to register. Please try again.' });
    }
});

// Login endpoint
app.post('/api/login', (req, res) => {
    try {
        const { phone, password } = req.body;
        
        if (!phone || !password) {
            return res.status(400).json({ success: false, message: 'Phone and password are required' });
        }

        const user = userStore.get(phone);
        
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found. Please register first.' });
        }

        if (user.password !== password) {
            return res.status(400).json({ success: false, message: 'Invalid password' });
        }

        res.json({ 
            success: true, 
            message: 'Login successful',
            user: {
                phone: user.phone,
                userId: user.userId,
                balance: user.balance,
                bonus: user.bonus
            }
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Failed to login' });
    }
});

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('📱 Direct Registration System Ready!');
    console.log('🎮 Color Prediction Game Active');
});