const express = require('express');
const { getNonce, verifySignature, loginWithPassword } = require('../controllers/authController');

const router = express.Router();

router.get('/nonce/:walletAddress', getNonce);
router.post('/verify', verifySignature);
router.post('/login-password', loginWithPassword);

module.exports = router;