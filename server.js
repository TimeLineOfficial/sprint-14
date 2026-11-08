/**
 * ApexTrack Enterprise — The Walking Skeleton (Server Entrypoint)
 * Sprint 14 Capstone MVP
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./src/routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Global Middleware
app.use(cors());
app.use(express.json());

// Serve Static Frontend (Walking Skeleton UI)
app.use(express.static(path.join(__dirname, 'public')));

// Mount API Controllers
app.use('/api', apiRoutes);

// Catch-All SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server if invoked directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[WALKING SKELETON] Server running on http://localhost:${PORT}`);
    console.log(`[AUTH PERIMETER] Protected routes guarded by JWT middleware.`);
  });
}

module.exports = app;
