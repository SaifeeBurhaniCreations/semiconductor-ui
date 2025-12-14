
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { LogicNode, ModuleType } from '../types';
import { NodeContextMenu } from './NodeContextMenu';
import { ZoomIn, ZoomOut, Maximize, Layers, Search, X } from 'lucide-react';

interface LogicGraphProps {
  nodes: LogicNode[];
  onNodeSelect?: (nodeId: string) => void;
  onEdgeSelect?: (edgeId: string) => void;
  selectedNodeId?: string | null;
  selectedEdgeId?: string | null;
  builderMode?: boolean; 
  layoutTrigger?: number; 
}

export const LogicGraph: React.FC<LogicGraphProps> = ({ 
    nodes, 
    onNodeSelect, 
    onEdgeSelect, 
    selectedNodeId, 
    selectedEdgeId,
    builderMode, 
    layoutTrigger = 0 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // State
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, nodeId: string } | null>(null);
  const [heatmapMode, setHeatmapMode] = useState(false);
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');

  // D3 Selection Refs
  const gRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const simulationRef = useRef<d3.Simulation<d3.SimulationNodeDatum, undefined> | null>(null);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current || nodes.length === 0) return;

    const width = wrapperRef.current.clientWidth;
    const height = wrapperRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear

    // Create container group for Zoom
    const g = svg.append("g");
    gRef.current = g;

    // Zoom Behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
            setTransform(event.transform); 
        });
    
    zoomRef.current = zoom;
    svg.call(zoom);

    // Prepare Links with IDs
    const links: any[] = [];
    nodes.forEach(node => {
        node.connections.forEach(targetId => {
            const target = nodes.find(n => n.id === targetId);
            if (target) {
                // Determine source/target order for consistent ID if undirected, but this is directed logic flow
                // ID format: source-target
                links.push({ 
                    source: node.id, 
                    target: target.id, 
                    id: `${node.id}-${target.id}` 
                });
            }
        });
    });

    // Simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(70));
    
    simulationRef.current = simulation;

    // Arrowhead
    const defs = svg.append("defs");
    defs.append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 28)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#2b3a4a");
      
    // Selected Arrowhead
    defs.append("marker")
      .attr("id", "arrowhead-selected")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 28)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#a855f7"); // Purple

    // Edges
    // Need a group for lines to ensure they are behind nodes
    const linkGroup = g.append("g").attr("class", "links");
    
    const link = linkGroup
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", (d: any) => d.id === selectedEdgeId ? "#a855f7" : "#1c2633") // Purple if selected
      .attr("stroke-width", (d: any) => d.id === selectedEdgeId ? 3 : 2)
      .attr("marker-end", (d: any) => d.id === selectedEdgeId ? "url(#arrowhead-selected)" : "url(#arrowhead)")
      .attr("class", "cursor-pointer transition-all duration-300 hover:stroke-cyan-500/50")
      .on("click", (event, d: any) => {
          event.stopPropagation();
          if (onEdgeSelect) onEdgeSelect(d.id);
          setContextMenu(null);
      });

    // Nodes Group
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("click", (event, d) => {
          event.stopPropagation();
          if (onNodeSelect) onNodeSelect(d.id);
          setContextMenu(null);
      })
      .on("contextmenu", (event, d) => {
          event.preventDefault();
          setContextMenu({ x: event.clientX, y: event.clientY, nodeId: d.id });
      });

    // Node Shape (Hexagon)
    node.append("path")
      .attr("d", "M0,-24 L20.78,-12 L20.78,12 L0,24 L-20.78,12 L-20.78,-12 Z") 
      .attr("fill", (d: LogicNode) => {
          if (heatmapMode) {
              const heat = Math.random();
              if (heat > 0.8) return "#ef4444"; 
              if (heat > 0.5) return "#f97316"; 
              return "#0a0f16";
          }
          return d.id === selectedNodeId ? "#164e63" : "#0a0f16";
      })
      .attr("stroke", (d: LogicNode) => {
          if (d.id === selectedNodeId) return "#22d3ee";
          return d.status === 'active' ? "#06b6d4" : d.status === 'error' ? "#ef4444" : "#2b3a4a";
      })
      .attr("stroke-width", (d: LogicNode) => d.id === selectedNodeId ? 3 : 2)
      .attr("class", "transition-colors duration-300 cursor-pointer");

    // Liveness Indicator (Center)
    node.filter((d: LogicNode) => d.status === 'active')
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 4)
      .attr("fill", "rgba(34, 211, 238, 0.2)")
      .attr("class", "animate-ping");

    // Health Status Indicator (Small dot on rim)
    node.append("circle")
      .attr("cx", 14)
      .attr("cy", -14)
      .attr("r", 4)
      .attr("fill", (d: LogicNode) => {
          switch(d.status) {
              case 'active': return "#10b981"; // Green
              case 'idle': return "#f59e0b"; // Yellow/Orange
              case 'error': return "#ef4444"; // Red
              default: return "#64748b"; // Slate
          }
      })
      .attr("stroke", "#0a0f16")
      .attr("stroke-width", 1);

    // Labels
    node.append("text")
      .text((d: LogicNode) => d.label)
      .attr("dy", 38)
      .attr("text-anchor", "middle")
      .attr("fill", (d: LogicNode) => d.id === selectedNodeId ? "#e2e8f0" : "#94a3b8")
      .attr("font-family", "Fira Code")
      .attr("font-size", "10px")
      .style("pointer-events", "none");

    // Icons
    node.append("text")
      .text((d: LogicNode) => {
        if(d.type.includes('AI')) return 'AI';
        if(d.type.includes('SENSOR')) return 'IN';
        if(d.type.includes('ACTUATOR')) return 'OUT';
        return 'LOG';
      })
      .attr("dy", 4)
      .attr("text-anchor", "middle")
      .attr("fill", (d: LogicNode) => d.status === 'active' || d.id === selectedNodeId ? "#22d3ee" : "#475569")
      .attr("font-family", "Inter")
      .attr("font-weight", "bold")
      .attr("font-size", "10px")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

  }, [nodes, selectedNodeId, selectedEdgeId, heatmapMode, builderMode]); // Re-render when props change

  // Handle layout trigger
  useEffect(() => {
      if (simulationRef.current) {
          simulationRef.current.alpha(1).restart();
      }
  }, [layoutTrigger]);

  // Handle Search
  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (!searchQuery.trim() || !wrapperRef.current || !svgRef.current || !zoomRef.current) return;

      const targetNode = nodes.find(n => 
          n.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
          n.id.toLowerCase() === searchQuery.toLowerCase()
      );

      if (targetNode && targetNode.x !== undefined && targetNode.y !== undefined) {
          if (onNodeSelect) onNodeSelect(targetNode.id);
          
          const width = wrapperRef.current.clientWidth;
          const height = wrapperRef.current.clientHeight;
          const scale = 1.5;
          const x = -targetNode.x * scale + width / 2;
          const y = -targetNode.y * scale + height / 2;

          const transform = d3.zoomIdentity.translate(x, y).scale(scale);
          
          d3.select(svgRef.current)
            .transition()
            .duration(750)
            .call(zoomRef.current.transform, transform);
      }
  };

  // Zoom Controls
  const handleZoom = (factor: number) => {
      if (!svgRef.current || !zoomRef.current) return;
      d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, factor);
  };
  const handleFit = () => {
       if (!svgRef.current || !zoomRef.current || !wrapperRef.current) return;
       // Simple reset for now
       d3.select(svgRef.current).transition().duration(750).call(zoomRef.current.transform, d3.zoomIdentity.translate(wrapperRef.current.clientWidth/2, wrapperRef.current.clientHeight/2));
  };

  return (
    <div 
        ref={wrapperRef} 
        className="w-full h-full bg-quantum-900 border border-quantum-600 rounded-lg overflow-hidden relative shadow-lg"
        onClick={() => {
            setContextMenu(null);
            if(onNodeSelect) onNodeSelect(""); // Clear selection
            if(onEdgeSelect) onEdgeSelect(""); 
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
            e.preventDefault();
            const type = e.dataTransfer.getData('nodeType');
            if (type && builderMode) {
                // In a real app, we'd add the node here.
                alert(`Added new ${type} node at ${e.clientX}, ${e.clientY}`);
            }
        }}
    >
       {/* Background Grid */}
       <div className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{ 
                backgroundImage: 'linear-gradient(#2b3a4a 1px, transparent 1px), linear-gradient(90deg, #2b3a4a 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                transform: `scale(${transform.k}) translate(${transform.x % 40}px, ${transform.y % 40}px)`
            }}>
       </div>

       {/* Toolbar */}
       <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2 pointer-events-auto">
            <div className="flex flex-col bg-quantum-950 border border-quantum-700 rounded-lg overflow-hidden shadow-xl">
                <button onClick={() => handleZoom(1.2)} className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-quantum-800 transition-colors" title="Zoom In"><ZoomIn className="w-4 h-4" /></button>
                <div className="h-px bg-quantum-700"></div>
                <button onClick={() => handleZoom(0.8)} className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-quantum-800 transition-colors" title="Zoom Out"><ZoomOut className="w-4 h-4" /></button>
                <div className="h-px bg-quantum-700"></div>
                <button onClick={handleFit} className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-quantum-800 transition-colors" title="Fit to Screen"><Maximize className="w-4 h-4" /></button>
            </div>

            <div className="flex flex-col bg-quantum-950 border border-quantum-700 rounded-lg overflow-hidden shadow-xl">
                 <button 
                    onClick={() => setHeatmapMode(!heatmapMode)}
                    className={`p-2 transition-colors ${heatmapMode ? 'text-orange-400 bg-quantum-800' : 'text-slate-400 hover:text-orange-400 hover:bg-quantum-800'}`} 
                    title="Toggle Heatmap"
                 >
                     <Layers className="w-4 h-4" />
                 </button>
            </div>
       </div>

       {/* Top Status & Search */}
       <div className="absolute top-0 left-0 right-0 p-3 z-10 flex justify-between items-start pointer-events-none">
            <div className="flex space-x-2 pointer-events-auto">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-500 bg-quantum-950/80 px-2 py-1 border border-quantum-600 rounded backdrop-blur flex items-center">
                    Topology {builderMode ? '[BUILDER]' : '[VIEWER]'}
                </span>
                {heatmapMode && (
                    <span className="text-xs font-mono uppercase tracking-widest text-orange-400 bg-orange-950/80 px-2 py-1 border border-orange-600/50 rounded backdrop-blur animate-pulse">
                        HEATMAP ACTIVE
                    </span>
                )}
            </div>

            <form onSubmit={handleSearch} className="flex items-center pointer-events-auto relative group">
                <div className="flex items-center bg-quantum-950/80 backdrop-blur border border-quantum-600 rounded-lg px-2 py-1 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all">
                    <Search className="w-3 h-3 text-slate-500 mr-2" />
                    <input 
                        type="text" 
                        placeholder="Search Node..." 
                        className="bg-transparent border-none text-xs text-slate-200 focus:outline-none w-32 placeholder-slate-600"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button type="button" onClick={() => setSearchQuery('')} className="text-slate-500 hover:text-white">
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>
            </form>
       </div>

       {/* SVG Canvas */}
       <svg ref={svgRef} className="w-full h-full cursor-move" />

       {/* Context Menu */}
       {contextMenu && (
           <NodeContextMenu 
                x={contextMenu.x} 
                y={contextMenu.y} 
                nodeId={contextMenu.nodeId}
                onClose={() => setContextMenu(null)}
                onAction={(action, id) => console.log(`Action: ${action} on Node: ${id}`)}
           />
       )}
    </div>
  );
};
