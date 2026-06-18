// D:\AxiomGraphPro\axiom-frontend\src\App.jsx
import React, { useState, useMemo } from 'react';
import { Upload, Cpu, Search, Layers, ListOrdered, FileText, Volume2, HelpCircle, BarChart3, Shield, GitBranch, Eye } from 'lucide-react';
import GraphCanvas from './GraphCanvas';

export default function App() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [academyNode, setAcademyNode] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [editorTheme, setEditorTheme] = useState('cyber-void');
  const [commitTimeline, setCommitTimeline] = useState(100);
  const [aiExplanation, setAiExplanation] = useState({ definition: '', functions: '', dependencies: '' });

  const triggerVoiceSynthesis = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  const processAcademicExplanation = (node) => {
    if (!node) return;
    
    let definition = `This class maintains absolute ownership of structural components inside "${node.id}". `;
    if (node.id.toLowerCase().includes('service') || node.id.toLowerCase().includes('api')) {
      definition += "Operates strictly as an asynchronous networking gateway managing REST endpoints and payload transactions.";
    } else if (node.id.toLowerCase().includes('activity') || node.id.toLowerCase().includes('adapter')) {
      definition += "Acts as a primary viewport rendering layout framework, linking operational lifecycle hooks directly to component states.";
    } else if (node.id.toLowerCase().includes('binding')) {
      definition += "Serves as an optimized UI element lookup bridge layer to eliminate programmatic view inflator overhead.";
    } else {
      definition += "Defines a clean enterprise data encapsulation model storing properties, entity parameters, and state tokens.";
    }

    let functions = `Detected [${node.functionsCount || 1}] active functional routines. Includes decoupled modular blocks executing over core threads to manage internal variables safely without latency traps.`;
    
    let dependencies = `Maintains [${node.outboundCount || 0}] reference channels. This node relies directly on external bindings while feeding upstream layout parameters into [${node.inboundCount || 0}] dependent branches.`;

    setAiExplanation({ definition, functions, dependencies });
  };

  const handleSingleClick = (node) => {
    setSelectedNode(node);
    processAcademicExplanation(node);
    triggerVoiceSynthesis(`Previewing metrics for ${node.id.split('.')[0]}`);
  };

  const handleDoubleClick = (node) => {
    setSelectedNode(node);
    setAcademyNode(node);
    processAcademicExplanation(node);
    triggerVoiceSynthesis(`Opening structural source engine workspace for ${node.id.split('.')[0]}`);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/ingest', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Ingestion pipeline failed.');
      const data = await response.json();
      
      setGraphData({ nodes: data.nodes || [], links: data.links || [] });
      if (data.nodes && data.nodes.length > 0) {
        setSelectedNode(data.nodes[0]);
        setAcademyNode(null);
        processAcademicExplanation(data.nodes[0]);
        triggerVoiceSynthesis("Project repository mapping ingestion completed successfully.");
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const executeSemanticQuery = async () => {
    if (!searchQuery) return;
    setAiAnalysis("Analyzing vector code matrix parameters...");
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: searchQuery }),
      });
      const data = await response.json();
      
      if (data.target_node && graphData.nodes) {
        const matchedNode = graphData.nodes.find(n => n.id === data.target_node);
        if (matchedNode) {
          setAiAnalysis(`[Vector DB Sync]: Located optimal architectural match inside module: ${matchedNode.id}`);
          handleDoubleClick(matchedNode);
        }
      } else {
        setAiAnalysis("[Vector DB Sync]: Prompt pattern scanned. No overlapping file clusters triggered.");
        triggerVoiceSynthesis("No contextual node match resolved.");
      }
    } catch (err) {
      setAiAnalysis(`Query error: ${err.message}`);
    }
  };

  const highlightedCodeStream = useMemo(() => {
    if (!selectedNode || !selectedNode.rawCode) return null;
    
    const lines = selectedNode.rawCode.split('\n');
    return lines.map((line, idx) => {
      let cleanLine = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      if (editorTheme === 'cyber-void') {
        cleanLine = cleanLine
          .replace(/\b(import|package|public|private|protected|class|extends|implements|return|def|function|const|let|var|if|else|for|while|new)\b/g, '<span style="color: #22d3ee; font-weight: bold;">$1</span>')
          .replace(/(".*?"|'[^']*?')/g, '<span style="color: #4ade80;">$1</span>')
          .replace(/(\/\/.*|\/\*.*?\*\/)/g, '<span style="color: #4b5563; font-style: italic;">$1</span>')
          .replace(/\b([a-zA-Z0-9_]+\s*)(?=\()/g, '<span style="color: #c084fc;">$1</span>');
      } else {
        cleanLine = cleanLine
          .replace(/\b(import|package|public|private|protected|class|extends|implements|return|def|function|const|let|var|if|else|for|while|new)\b/g, '<span style="color: #0550ae; font-weight: bold;">$1</span>')
          .replace(/(".*?"|'[^']*?')/g, '<span style="color: #0a3069;">$1</span>')
          .replace(/(\/\/.*|\/\*.*?\*\/)/g, '<span style="color: #6a737d; font-style: italic;">$1</span>')
          .replace(/\b([a-zA-Z0-9_]+\s*)(?=\()/g, '<span style="color: #6f42c1;">$1</span>');
      }

      return (
        <div key={idx} className="table-row hover:bg-gray-900/30 px-1">
          <span className="table-cell text-gray-600 text-right pr-4 select-none w-8 text-[10px] border-r border-gray-900">{idx + 1}</span>
          <span className="table-cell pl-3 break-all whitespace-pre" dangerouslySetInnerHTML={{ __html: cleanLine || '&nbsp;' }} />
        </div>
      );
    });
  }, [selectedNode, editorTheme]);

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-gray-950 text-gray-100 flex flex-col select-none font-mono">
      
      {/* Top Header */}
      <header className="h-14 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse" />
          <h1 className="text-sm font-black tracking-widest text-cyan-400">
            AXIOMGRAPH PRO &bull; <span className="text-gray-400 font-bold text-[11px]">© Talal Ashraf</span>
          </h1>
        </div>
        <div className="text-[11px] text-gray-400 bg-gray-950 px-3 py-1 border border-gray-800 rounded flex items-center gap-2">
          <Volume2 size={12} className="text-green-400" /> VOICE MATRIX: ACTIVE
        </div>
      </header>

      {/* Main Framework Grid Setup */}
      <div className="flex-1 relative overflow-hidden flex flex-col justify-between">
        
        {/* Full Screen WebGL Space */}
        <div className="absolute inset-0 z-0">
          <GraphCanvas 
            graphData={graphData} 
            selectedNode={selectedNode} 
            onSelectNode={handleSingleClick}
            onDoubleClickNode={handleDoubleClick}
            commitTimelineIndex={commitTimeline}
          />
        </div>

        {/* HUD SCREEN LAYOUT CHANNELS */}
        <div className="w-full flex-1 relative pointer-events-none flex justify-between p-3 z-10 overflow-hidden">
          
          {/* Left Panel Sidebar */}
          <div className="w-85 h-full bg-gray-900/90 backdrop-blur-md border border-gray-800 rounded-lg p-4 flex flex-col gap-4 shadow-2xl pointer-events-auto overflow-hidden">
            <div>
              <h2 className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider flex items-center gap-1.5 mb-1.5">
                <Upload size={11} /> Vault Ingest
              </h2>
              <label className="flex flex-col items-center justify-center border border-dashed border-gray-800 rounded-md py-4 cursor-pointer hover:border-cyan-500 transition-colors bg-gray-950/50">
                <Cpu className={`text-cyan-400 mb-1 ${isUploading ? 'animate-spin' : ''}`} size={18} />
                <span className="text-[10px] text-gray-400">{isUploading ? "Streaming Bytes..." : "Upload Project (.zip)"}</span>
                <input type="file" accept=".zip" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* Core Registry Table Module List */}
            <div className="flex-1 flex flex-col bg-gray-950/90 border border-gray-800 rounded p-3 overflow-hidden">
              <h3 className="text-gray-400 text-[10px] font-bold border-b border-gray-800 pb-2 mb-2 flex items-center gap-1.5 uppercase tracking-wide">
                <ListOrdered size={12} /> Pure Core Logic Modules
              </h3>
              <div className="flex-1 overflow-y-auto pointer-events-auto pr-1 text-[11px] space-y-0.5 custom-scrollbar">
                {!graphData.nodes || graphData.nodes.length === 0 ? (
                  <div className="text-gray-600 text-center py-12 italic text-[10px]">No core source loaded.</div>
                ) : (
                  <table className="w-full text-left table-fixed">
                    <thead>
                      <tr className="text-gray-500 border-b border-gray-950/40 text-[9px]">
                        <th className="pb-1 w-2/3">MODULE NAME</th>
                        <th className="pb-1 w-1/3 text-right">WEIGHT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {graphData.nodes.map((node) => (
                        <tr 
                          key={node.id} 
                          onClick={() => handleSingleClick(node)}
                          onDoubleClick={() => handleDoubleClick(node)}
                          className={`cursor-pointer transition-all border-b border-b-gray-900/60 hover:bg-cyan-950/30 
                            ${selectedNode?.id === node.id ? 'bg-cyan-950/60 text-cyan-400 font-bold border-l-2 border-l-cyan-400 pl-2' : 'text-gray-300'}`}
                        >
                          <td className="py-1.5 truncate text-[11px]">{node.id}</td>
                          <td className="py-1.5 text-right text-purple-400 text-[10px]">{node.size || 0} KB</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Ingestion Prompt Search Hub */}
            <div className="bg-gray-950/90 border border-gray-800 rounded p-3">
              <h3 className="text-[10px] font-bold text-gray-400 mb-1.5 uppercase flex items-center gap-1">
                <Search size={11} /> Conceptual Learning Copilot
              </h3>
              <div className="flex gap-1">
                <input
                  type="text"
                  placeholder="Ask about logic flows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-gray-900 border border-gray-800 rounded px-2 py-1 text-[11px] text-gray-200 focus:outline-none focus:border-cyan-400"
                />
                <button onClick={executeSemanticQuery} className="bg-cyan-950 border border-cyan-800 text-cyan-400 text-[11px] px-2.5 rounded hover:bg-cyan-900 font-bold">Find</button>
              </div>
              {aiAnalysis && (
                <p className="mt-2 text-[9px] leading-relaxed text-cyan-300 bg-cyan-950/30 p-2 rounded border border-cyan-900/40 max-h-16 overflow-y-auto">
                  {aiAnalysis}
                </p>
              )}
            </div>
          </div>

          {/* Right Panel Sidebar Analytics Inspector */}
          {selectedNode && (
            <div className="w-80 h-full bg-gray-900/90 backdrop-blur-md border border-gray-800 rounded-lg p-4 flex flex-col gap-4 shadow-2xl pointer-events-auto">
              <div className="border rounded-lg p-3.5 border-gray-800 bg-gray-950/40">
                <h2 className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 mb-2 text-purple-400">
                  <Layers size={12} /> Ingested Meta
                </h2>
                <div className="bg-gray-950/90 border border-gray-800 rounded p-2.5 space-y-1 text-[11px]">
                  <div className="text-gray-400 truncate"><span className="text-gray-600 mr-1">PATH:</span>{selectedNode.path || 'N/A'}</div>
                  <div className="flex justify-between border-t border-gray-900 pt-1.5">
                    <div><span className="text-gray-600 mr-1">SIZE:</span><span className="text-cyan-400">{selectedNode.size || 0} KB</span></div>
                    <div><span className="text-gray-600 mr-1">STATUS:</span><span className="text-green-400 font-bold">STABLE</span></div>
                  </div>
                </div>
              </div>

              {/* Dynamic File Statistics & Complexity Score Counter Grid */}
              <div className="border border-gray-800 rounded-lg p-3.5 bg-gray-950/40 space-y-3">
                <h3 className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 pb-1.5 border-b border-gray-900">
                  <BarChart3 size={12} /> Engineering Telemetry
                </h3>
                <div className="grid grid-cols-2 gap-2 text-center font-mono">
                  <div className="bg-gray-950 p-2 border border-gray-900 rounded">
                    <span className="text-gray-500 block text-[9px]">FUNCTIONS</span>
                    <span className="text-xs text-purple-400 font-bold">{selectedNode.functionsCount || 1}</span>
                  </div>
                  <div className="bg-gray-950 p-2 border border-gray-900 rounded">
                    <span className="text-gray-500 block text-[9px]">COMPLEXITY</span>
                    <span className={`text-xs font-bold ${selectedNode.complexityRating === 'Hard' ? 'text-red-400' : selectedNode.complexityRating === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                      {selectedNode.complexityIndex || 10}%
                    </span>
                  </div>
                </div>
                <div className="bg-gray-950 p-2 border border-gray-900 rounded text-center text-[10px]">
                  RATING SCALE: <span className={`font-bold ${selectedNode.complexityRating === 'Hard' ? 'text-red-400' : selectedNode.complexityRating === 'Medium' ? 'text-yellow-400' : 'text-green-400'}`}>{selectedNode.complexityRating || 'Easy'}</span>
                </div>
                
                {/* Vector Link Connections Count Grid */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="text-[10px] text-gray-400 bg-gray-950 border border-gray-900 p-1.5 rounded text-center">
                    Inbound: <span className="text-cyan-400 font-bold">{selectedNode.inboundCount || 0}</span>
                  </div>
                  <div className="text-[10px] text-gray-400 bg-gray-950 border border-gray-900 p-1.5 rounded text-center">
                    Outbound: <span className="text-purple-400 font-bold">{selectedNode.outboundCount || 0}</span>
                  </div>
                </div>
              </div>

              {/* Dependency Vectors Panel */}
              <div className="flex-1 bg-gray-950/40 border border-gray-800 rounded-lg p-3.5 flex flex-col overflow-hidden">
                <h3 className="text-[11px] font-bold text-purple-400 mb-1.5 uppercase flex items-center gap-1">
                  <Shield size={12} /> Map Linkages
                </h3>
                <div className="flex-1 text-[11px] space-y-2 overflow-y-auto pr-1">
                  <div>
                    <div className="flex flex-wrap gap-1">
                      {selectedNode.dependencies && selectedNode.dependencies.length > 0 ? (
                        selectedNode.dependencies.map((dep, idx) => (
                          <span key={idx} className="bg-gray-950 border border-gray-800 text-cyan-400 px-1.5 py-0.5 rounded text-[9px]">{dep}</span>
                        ))
                      ) : (
                        <span className="text-gray-600 text-[10px] italic">Standalone component.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* STEP 6: GIT TIME-MACHINE HORIZONTAL SLIDER AXIS */}
        <div className="w-[calc(100vw-1.5rem)] mx-3 relative z-20 pointer-events-auto bg-gray-900/90 border border-gray-800 p-3 rounded-lg flex items-center gap-4 shadow-xl">
          <div className="text-xs text-cyan-400 font-bold flex items-center gap-1.5 min-w-[150px]">
            <GitBranch size={14} /> Git Evolution: {commitTimeline}%
          </div>
          <input 
            type="range" 
            min="10" 
            max="100" 
            value={commitTimeline} 
            onChange={(e) => {
              setCommitTimeline(Number(e.target.value));
              if (Number(e.target.value) % 20 === 0) {
                triggerVoiceSynthesis(`Scaling timeline matrix to index ${e.target.value}`);
              }
            }}
            className="flex-1 accent-cyan-400 bg-gray-950 h-1.5 rounded cursor-pointer border border-gray-800"
          />
          <div className="text-[10px] text-gray-500 font-mono tracking-wider">HISTORICAL SYNC</div>
        </div>

        {/* ACADEMY WORKSPACE PANEL CORE (Toggled via Double-Click) */}
        {academyNode && selectedNode && selectedNode.rawCode && (
          <div className="w-[calc(100vw-1.5rem)] h-72 m-3 mt-0 bg-gray-900/95 border border-cyan-900/50 rounded-lg p-3.5 z-20 flex flex-col shadow-2xl transition-all animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-2">
              <div className="text-xs font-bold flex items-center gap-1.5 text-cyan-400">
                <FileText size={13} /> ACADEMY VIEWPORT CORE &bull; <span className="text-gray-400 font-normal">{selectedNode.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setEditorTheme(editorTheme === 'cyber-void' ? 'high-contrast' : 'cyber-void')}
                  className="text-[10px] px-2 py-0.5 bg-gray-950 border border-gray-800 hover:border-cyan-400 text-cyan-400 font-bold rounded uppercase flex items-center gap-1"
                >
                  <Eye size={10} /> Theme: {editorTheme === 'cyber-void' ? "Void Dark" : "Contrast Light"}
                </button>
                <button 
                  onClick={() => setAcademyNode(null)}
                  className="text-[10px] px-2 py-0.5 bg-gray-950 border border-gray-800 hover:border-red-500 text-red-400 font-bold rounded uppercase"
                >
                  Close Console [X]
                </button>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-2 gap-4 overflow-hidden">
              {/* Multicolor Code Canvas Pane */}
              <div className={`overflow-auto p-3 rounded border border-gray-900 transition-colors ${editorTheme === 'cyber-void' ? 'bg-gray-950' : 'bg-gray-50'}`}>
                <pre className="text-[11px] leading-relaxed font-mono whitespace-pre select-text text-gray-300">
                  {highlightedCodeStream}
                </pre>
              </div>

              {/* AI Structured Deep Academic Explainer Pane */}
              <div className="overflow-auto border border-cyan-900/40 bg-cyan-950/10 rounded p-3 text-left flex flex-col space-y-2 font-mono text-xs">
                <div>
                  <span className="text-cyan-400 font-bold uppercase tracking-wider block text-[10px] mb-0.5">&gt;&gt; Class Definition</span>
                  <p className="text-cyan-100/90 leading-relaxed">{aiExplanation.definition || 'No definition available.'}</p>
                </div>
                <div className="border-t border-gray-900/60 pt-2">
                  <span className="text-purple-400 font-bold uppercase tracking-wider block text-[10px] mb-0.5">&gt;&gt; Core Functions</span>
                  <p className="text-cyan-100/90 leading-relaxed">{aiExplanation.functions || 'No functions data available.'}</p>
                </div>
                <div className="border-t border-gray-900/60 pt-2">
                  <span className="text-cyan-400 font-bold uppercase tracking-wider block text-[10px] mb-0.5">&gt;&gt; Active Dependencies</span>
                  <p className="text-cyan-100/90 leading-relaxed">{aiExplanation.dependencies || 'No dependencies data available.'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Credit - Bottom Right */}
        <div className="absolute bottom-16 right-4 text-[10px] text-cyan-500/30 font-mono tracking-wider select-none pointer-events-none z-30">
          © Talal Ashraf
        </div>

      </div>
    </div>
  );
}