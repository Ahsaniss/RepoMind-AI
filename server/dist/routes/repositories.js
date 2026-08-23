"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.repositoriesRouter = void 0;
const express_1 = require("express");
exports.repositoriesRouter = (0, express_1.Router)();
/** GET /api/repositories — List all connected repositories */
exports.repositoriesRouter.get('/', (_req, res) => {
    // TODO: Return from database
    res.json([]);
});
/** GET /api/repositories/:id — Get a single repository */
exports.repositoriesRouter.get('/:id', (req, res) => {
    // TODO: Fetch from database
    res.json({ id: req.params.id, message: 'Repository stub' });
});
/** POST /api/repositories/:id/analyze — Run analysis on a repository */
exports.repositoriesRouter.post('/:id/analyze', async (req, res) => {
    try {
        // TODO: Wire up repositoryAnalyzer service
        res.json({
            repositoryId: req.params.id,
            timestamp: new Date().toISOString(),
            score: 0,
            issues: [],
            summary: 'Analysis not yet implemented',
            metrics: {
                codeQuality: 0,
                security: 0,
                performance: 0,
                maintainability: 0,
                testCoverage: 0,
                documentation: 0,
            },
        });
    }
    catch (error) {
        console.error('Analysis error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
/** GET /api/repositories/:id/analysis — Get latest analysis */
exports.repositoriesRouter.get('/:id/analysis', (req, res) => {
    // TODO: Fetch latest analysis from database
    res.json({ repositoryId: req.params.id, message: 'No analysis yet' });
});
//# sourceMappingURL=repositories.js.map