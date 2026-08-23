/**
 * GitHub OAuth Service
 * Client ID / Client Secret are NEVER sent to the browser.
 */
/** Build the GitHub OAuth authorization URL */
export declare function getAuthUrl(): string;
/** Exchange an OAuth code for an access token */
export declare function exchangeCode(code: string): Promise<string>;
export interface GitHubUser {
    id: number;
    login: string;
    name: string;
    avatar_url: string;
    email: string | null;
    public_repos: number;
}
/** Fetch the authenticated GitHub user */
export declare function getGitHubUser(token: string): Promise<GitHubUser>;
export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    updated_at: string;
    html_url: string;
    default_branch: string;
    visibility: string;
    topics: string[];
    owner: {
        login: string;
        avatar_url: string;
    };
}
/** Fetch repositories for the authenticated user */
export declare function getGitHubRepos(token: string): Promise<GitHubRepo[]>;
//# sourceMappingURL=github.d.ts.map