import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { demoAnalysis } from '../data/demoRepository';
import { supabase } from '../supabase';

const METRICS = [
  { key: 'codeQuality',    label: 'Code Quality',    color: '#8B5CF6' },
  { key: 'security',       label: 'Security',        color: '#EF4444' },
  { key: 'performance',    label: 'Performance',     color: '#F59E0B' },
  { key: 'maintainability',label: 'Maintainability', color: '#3B82F6' },
  { key: 'testCoverage',   label: 'Test Coverage',   color: '#10B981' },
  { key: 'documentation',  label: 'Documentation',   color: '#6366F1' },
];

export default function AnalysisPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let subscription: any;

    const fetchOrStartAnalysis = async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error('Not authenticated');

        // Check if an analysis already exists
        const { data: existing, error: fetchErr } = await supabase
          .from('repository_analyses')
          .select('*')
          .eq('repository_id', id)
          .eq('user_id', session.user.id)
          .limit(1)
          .single();

        if (existing && existing.status === 'completed') {
          setData(existing.result);
          setLoading(false);
          return;
        }

        // If not, insert a new pending analysis request
        if (!existing) {
          await supabase.from('repository_analyses').insert({
            user_id: session.user.id,
            repository_id: id,
            status: 'pending',
          });
        }

        // Subscribe to changes
        subscription = supabase
          .channel(`analysis-${id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'repository_analyses',
              filter: `repository_id=eq.${id}`,
            },
            (payload) => {
              const row = payload.new;
              if (row.status === 'completed') {
                setData(row.result);
                setLoading(false);
              } else if (row.status === 'failed') {
                setError(row.error_message || 'Analysis failed');
                setLoading(false);
              }
            }
          )
          .subscribe();
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrStartAnalysis();

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, [id]);

  if (loading) {
    return <div className="page-container"><p>⏳ Analyzing repository... this might take a minute.</p></div>;
  }

  if (error) {
    return <div className="page-container"><p style={{color: 'red'}}>⚠️ {error}</p></div>;
  }

  // Fallback to demo data if we couldn't load real data but didn't error (e.g. during initial setup)
  const analysisResult = data || demoAnalysis;
  const { metrics, issues, score, summary } = analysisResult;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Code Analysis</h1>
          <p className="page-subtitle">Deep analysis of your repository quality.</p>
        </div>
        <div className="analysis-score-badge">{score}<span>/100</span></div>
      </div>
      <p className="analysis-summary">{summary}</p>
      <div className="metrics-grid">
        {METRICS.map(m => {
          const val = metrics[m.key as keyof typeof metrics];
          return (
            <div key={m.key} className="metric-card">
              <div className="metric-header">
                <span className="metric-label">{m.label}</span>
                <span className="metric-value" style={{color: m.color}}>{val}</span>
              </div>
              <div className="metric-bar-bg">
                <div className="metric-bar-fill" style={{width:`${val}%`, background: m.color}} />
              </div>
            </div>
          );
        })}
      </div>
      <h2 className="section-title" style={{marginTop:'2rem'}}>Issues</h2>
      <div className="issues-list">
        {issues.map(issue => (
          <div key={issue.id} className="issue-row">
            <span className={`issue-severity issue-severity--${issue.severity}`}>{issue.severity.toUpperCase()}</span>
            <div className="issue-info">
              <p className="issue-title">{issue.title}</p>
              <p className="issue-file">{issue.file}:{issue.line}</p>
              <p className="issue-desc">{issue.description}</p>
            </div>
            <span className="issue-category">{issue.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
