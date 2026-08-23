"use strict";
/**
 * GitHub OAuth Service
 * Client ID / Client Secret are NEVER sent to the browser.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthUrl = getAuthUrl;
exports.exchangeCode = exchangeCode;
exports.getGitHubUser = getGitHubUser;
exports.getGitHubRepos = getGitHubRepos;
const CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';
const REDIRECT_URI = 'http://localhost:3001/api/github/callback';
if (!CLIENT_ID || !CLIENT_SECRET) {
    console.warn('⚠️  GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET not set in .env');
}
/** Build the GitHub OAuth authorization URL */
function getAuthUrl() {
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        scope: 'repo read:user',
        redirect_uri: REDIRECT_URI,
    });
    return `https://github.com/login/oauth/authorize?${params}`;
}
/** Exchange an OAuth code for an access token */
async function exchangeCode(code) {
    const res = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, code, redirect_uri: REDIRECT_URI }),
    });
    const data = await res.json();
    if (data.error || !data.access_token) {
        throw new Error(data.error ?? 'Failed to exchange OAuth code');
    }
    return data.access_token;
}
/** Fetch the authenticated GitHub user */
async function getGitHubUser(token) {
    const res = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
    });
    if (!res.ok)
        throw new Error('Failed to fetch GitHub user');
    return res.json();
}
/** Fetch repositories for the authenticated user */
async function getGitHubRepos(token) {
    const res = await fetch('https://api.github.com/user/repos?per_page=50&sort=updated', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
    });
    if (!res.ok)
        throw new Error('Failed to fetch GitHub repos');
    return res.json();
}
//# sourceMappingURL=github.js.map