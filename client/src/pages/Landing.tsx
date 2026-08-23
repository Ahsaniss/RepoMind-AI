import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  GitBranch, 
  Search, 
  ShieldCheck, 
  FileCode, 
  BookOpen, 
  MessageSquare, 
  Terminal, 
  Folder, 
  FileJson, 
  FileCode2,
  ChevronRight,
  Send
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] font-sans overflow-x-hidden selection:bg-accent-violet/30">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-subtle bg-glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Terminal size={18} className="text-white" />
            </div>
            <span className="font-semibold text-lg tracking-tight">RepoMind AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors">
              Log in
            </Link>
            <Link to="/login" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-md hover:bg-zinc-200 transition-colors shadow-sm">
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-background-secondary)] border border-subtle text-sm text-[var(--color-text-secondary)] mb-8 shadow-sm">
          <Sparkles size={14} className="text-violet-400" />
          <span>Powered by Google Gemini</span>
        </div>

        {/* Headlines */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl">
          Your AI <span className="text-gradient">Software Engineer</span>
        </h1>
        <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mb-10 leading-relaxed">
          Connect your GitHub repository. Let our intelligent agent analyze your codebase, detect hidden bugs, map architecture, and chat with you using real, deep repository context.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <GitBranch size={18} />
            Connect GitHub
          </button>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--color-background-secondary)] text-white border border-subtle px-6 py-3 rounded-md font-medium hover:bg-[var(--color-card)] transition-colors">
            Try Demo Repository
            <ChevronRight size={16} className="text-[var(--color-text-secondary)]" />
          </button>
        </div>

        {/* IDE Mockup Visual */}
        <div className="w-full mt-20 relative perspective-1000">
          {/* Subtle glow behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-violet-500/20 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative rounded-xl overflow-hidden border border-subtle bg-[var(--color-card)] shadow-2xl shadow-black/50 flex flex-col h-[500px] md:h-[600px] text-left">
            
            {/* IDE Header */}
            <div className="h-12 border-b border-subtle bg-[var(--color-background-secondary)] flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
              </div>
              <div className="mx-auto text-xs font-mono text-[var(--color-text-secondary)] bg-[var(--color-background)] px-4 py-1 rounded-sm border border-subtle flex items-center gap-2">
                <GitBranch size={12}/> demo-user / repomind-demo
              </div>
            </div>

            {/* IDE Body */}
            <div className="flex flex-1 overflow-hidden">
              
              {/* Sidebar (File Tree) */}
              <div className="w-48 md:w-56 border-r border-subtle bg-[var(--color-background-secondary)] p-3 hidden sm:flex flex-col gap-1 overflow-y-auto">
                <div className="text-[10px] font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2 px-2">Explorer</div>
                
                <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-[var(--color-text-primary)] hover:bg-[var(--color-border-subtle)] rounded-md cursor-pointer">
                  <Folder size={14} className="text-blue-400" />
                  <span>src</span>
                </div>
                
                <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] rounded-md cursor-pointer pl-6">
                  <Folder size={14} className="text-blue-400" />
                  <span>components</span>
                </div>
                
                <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-[var(--color-text-primary)] bg-[var(--color-border-subtle)] rounded-md cursor-pointer pl-6">
                  <FileCode2 size={14} className="text-cyan-400" />
                  <span>auth.ts</span>
                </div>
                
                <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-border-subtle)] rounded-md cursor-pointer pl-6">
                  <FileJson size={14} className="text-yellow-400" />
                  <span>config.json</span>
                </div>
              </div>

              {/* Code Editor */}
              <div className="flex-1 bg-[var(--color-background)] p-4 md:p-6 overflow-y-auto relative font-mono text-xs md:text-sm leading-relaxed">
                <div className="flex">
                  <div className="text-[var(--color-text-secondary)] select-none text-right pr-4 border-r border-subtle/50 flex flex-col">
                    {[...Array(12)].map((_, i) => <span key={i}>{i + 1}</span>)}
                  </div>
                  <div className="pl-4">
                    <pre className="text-zinc-300">
                      <span className="text-violet-400">export async function</span> <span className="text-blue-400">loginUser</span>(req: Request) {'{\n'}
                      {'  '}const {'{'} email, password {'}'} = req.body;{'\n\n'}
                      {'  '}
                      <span className="text-zinc-500 italic">// Query database without sanitization (Vulnerable)</span>{'\n'}
                      {'  '}const query = <span className="text-green-400">`SELECT * FROM users WHERE email = '$`</span>{'{email}'}<span className="text-green-400">`'`</span>;{'\n'}
                      {'  '}const user = <span className="text-violet-400">await</span> db.<span className="text-blue-400">execute</span>(query);{'\n\n'}
                      {'  '}<span className="text-violet-400">if</span> (!user) {'{\n'}
                      {'    '}<span className="text-violet-400">throw new</span> <span className="text-yellow-200">Error</span>(<span className="text-green-400">'Invalid credentials'</span>);{'\n'}
                      {'  }'}{'\n\n'}
                      {'  '}return user;{'\n'}
                      {'}'}
                    </pre>
                  </div>
                </div>

                {/* Bug Highlighting Overlay */}
                <div className="absolute top-[88px] left-[52px] md:top-[108px] md:left-[60px] right-4 bg-red-500/10 border border-red-500/30 rounded px-2 py-0.5 text-xs">
                  <div className="absolute -top-6 right-0 bg-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px] font-sans font-medium flex items-center gap-1 border border-red-500/30 backdrop-blur-md">
                    <ShieldCheck size={10} /> SQL Injection Vulnerability
                  </div>
                </div>
              </div>

              {/* AI Chat Panel */}
              <div className="w-72 md:w-80 border-l border-subtle bg-[var(--color-card)] hidden md:flex flex-col">
                <div className="h-10 border-b border-subtle flex items-center px-4">
                  <span className="text-xs font-medium flex items-center gap-2 text-[var(--color-text-primary)]">
                    <Sparkles size={14} className="text-violet-400" />
                    AI Assistant
                  </span>
                </div>
                
                <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
                  <div className="bg-[var(--color-background-secondary)] rounded-lg p-3 text-sm text-[var(--color-text-primary)] border border-subtle self-end max-w-[85%] rounded-tr-sm">
                    Can you review auth.ts for security issues?
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-blue-500 flex-shrink-0 flex items-center justify-center mt-1">
                      <Terminal size={12} className="text-white" />
                    </div>
                    <div className="bg-transparent text-sm text-[var(--color-text-primary)] leading-relaxed">
                      I found a critical <span className="text-red-400 font-medium">SQL Injection vulnerability</span> on line 5. 
                      <br/><br/>
                      The email parameter is interpolated directly into the query string. You should use parameterized queries instead:
                      
                      <div className="mt-2 bg-[var(--color-background)] border border-subtle rounded-md p-2 font-mono text-xs">
                        <span className="text-zinc-500">// Fix:</span><br/>
                        const query = <span className="text-green-400">`SELECT * FROM users WHERE email = $1`</span>;<br/>
                        await db.<span className="text-blue-400">execute</span>(query, [email]);
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 border-t border-subtle bg-[var(--color-background-secondary)]">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Ask RepoMind..." 
                      className="w-full bg-[var(--color-background)] border border-subtle rounded-md pl-3 pr-8 py-2 text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-violet-500 transition-colors"
                      readOnly
                    />
                    <div className="absolute right-2 top-2 text-[var(--color-text-secondary)]">
                      <Send size={14} />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 border-t border-subtle bg-[var(--color-background-secondary)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Complete Context. Actionable Intelligence.</h2>
            <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              Our agents read your entire repository, understand how your files interlock, and provide deep insights that generic AI tools miss.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<Search />}
              title="Understand Your Codebase"
              description="Instantly map out massive legacy codebases. Ask 'where is the auth logic?' and get exact files, lines, and explanations."
            />
            <FeatureCard 
              icon={<ShieldCheck />}
              title="Find Bugs"
              description="Proactively scan commits for logic errors, race conditions, and edge cases before they hit production."
            />
            <FeatureCard 
              icon={<Terminal />}
              title="Security Analysis"
              description="Detect hardcoded secrets, SQL injections, XSS vulnerabilities, and outdated dependencies in your architecture."
            />
            <FeatureCard 
              icon={<FileCode />}
              title="Generate Tests"
              description="Automatically scaffold unit and integration tests for uncovered edge cases, tailored to your testing framework."
            />
            <FeatureCard 
              icon={<BookOpen />}
              title="Documentation"
              description="Keep your READMEs and inline docs perfectly synced with the actual codebase state. Never write manual docs again."
            />
            <FeatureCard 
              icon={<MessageSquare />}
              title="Ask Your Repository"
              description="Chat naturally with an AI that has your entire repo in context. No more copy-pasting snippets into ChatGPT."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-subtle text-center text-sm text-[var(--color-text-secondary)]">
        <p>© {new Date().getFullYear()} RepoMind AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-[var(--color-card)] border border-subtle rounded-xl p-6 hover:border-violet-500/50 transition-colors group">
      <div className="w-12 h-12 rounded-lg bg-[var(--color-background-secondary)] border border-subtle flex items-center justify-center text-violet-400 mb-6 group-hover:scale-110 group-hover:bg-violet-500/10 transition-all">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{description}</p>
    </div>
  );
}
