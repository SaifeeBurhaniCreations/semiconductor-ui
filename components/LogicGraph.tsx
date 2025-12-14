import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { LogicNode, ModuleType } from '../types';
import { NodeContextMenu } from './NodeContextMenu';
import { ZoomIn, ZoomOut, Maximize, Layers, Scan } from 'lucide-react';

interface LogicGraphProps {
  nodes: LogicNode[];
  onNodeSelect?: (nodeId: string) => void;
  selectedNodeId?: string | null;
  builderMode?: boolean; // New Prop
  layoutTrigger?: number; // Prop to trigger re-layout
}

export const LogicGraph: React.FC<LogicGraphProps> = ({ nodes, onNodeSelect, selectedNodeId, builderMode, layoutTrigger = 0 }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // State
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, nodeId: string } | null>(null);
  const [heatmapMode, setHeatmapMode] = useState(false);
  const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });

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
            setTransform(event.transform); // Sync state for UI controls if needed
        });
    
    zoomRef.current = zoom;
    svg.call(zoom);

    // Initial centering (only if not already transformed)
    // svg.call(zoom.transform, d3.zoomIdentity.translate(width/2, height/2).scale(0.8));

    // Links
    const links: any[] = [];
    nodes.forEach(node => {
        node.connections.forEach(targetId => {
            const target = nodes.find(n => n.id === targetId);
            if (target) links.push({ source: node.id, target: target.id });
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

    // Edges
    const link = g.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#1c2633")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead)");

    // Nodes Group
    const node = g.append("g")
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

    // Node Shape
    node.append("path")
      .attr("d", "M0,-24 L20.78,-12 L20.78,12 L0,24 L-20.78,12 L-20.78,-12 Z") // Hexagon
      .attr("fill", (d: LogicNode) => {
          if (heatmapMode) {
              // Mock heatmap logic
              const heat = Math.random();
              if (heat > 0.8) return "#ef4444"; // Hot
              if (heat > 0.5) return "#f97316"; // Warm
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

    // Liveness Indicator
    node.filter((d: LogicNode) => d.status === 'active')
      .append("circle")
      .attr("cx", 14)
      .attr("cy", -14)
      .attr("r", 4)
      .attr("fill", "#22d3ee")
      .attr("class", "animate-pulse");

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

  }, [nodes, selectedNodeId, heatmapMode, builderMode]); // Re-render when props change

  // Handle layout trigger
  useEffect(() => {
      if (simulationRef.current) {
          simulationRef.current.alpha(1).restart();
      }
  }, [layoutTrigger]);

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
        onClick={() => setContextMenu(null)}
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
       <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
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

       {/* Top Status */}
       <div className="absolute top-0 left-0 px-3 py-2 z-10 flex space-x-2">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-500 bg-quantum-950/80 px-2 py-1 border border-quantum-600 rounded backdrop-blur">
                Logic Topology {builderMode ? '[BUILDER]' : '[VIEWER]'}
            </span>
            {heatmapMode && (
                <span className="text-xs font-mono uppercase tracking-widest text-orange-400 bg-orange-950/80 px-2 py-1 border border-orange-600/50 rounded backdrop-blur animate-pulse">
                    HEATMAP ACTIVE
                </span>
            )}
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