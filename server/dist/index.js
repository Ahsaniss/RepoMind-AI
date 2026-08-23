"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ai_1 = require("./routes/ai");
const github_1 = require("./routes/github");
const repositories_1 = require("./routes/repositories");
const app = (0, express_1.default)();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express_1.default.json());
// Routes
app.use('/api/ai', ai_1.aiRouter);
app.use('/api/github', github_1.githubRouter);
app.use('/api/repositories', repositories_1.repositoriesRouter);
// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n  🧠 RepoMind AI server running at http://localhost:${PORT}\n`);
});
exports.default = app;
//# sourceMappingURL=index.js.map