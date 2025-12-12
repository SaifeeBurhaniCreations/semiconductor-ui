import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { LogicNode } from '../types';

interface LogicGraphProps {
  nodes: LogicNode[];
  onNodeSelect?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

export const LogicGraph: React.FC<LogicGraphProps> = ({ nodes, onNodeSelect, selectedNodeId }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    // Create links data
    const links: any[] = [];
    nodes.forEach(node => {
        node.connections.forEach(targetId => {
            const target = nodes.find(n => n.id === targetId);
            if (target) {
                links.push({ source: node.id, target: target.id });
            }
        });
    });

    // Simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(60));

    // Define marker for arrowheads
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25) // Distance from node center
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#2b3a4a");

    // Draw lines
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#1c2633")
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrowhead)");

    // Draw nodes groups
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("click", (event, d) => {
          if (onNodeSelect) {
              onNodeSelect(d.id);
          }
      });

    // Node shape (Hexagonish)
    node.append("path")
      .attr("d", "M0,-20 L17.32,-10 L17.32,10 L0,20 L-17.32,10 L-17.32,-10 Z") // Hexagon path
      .attr("fill", (d: LogicNode) => d.id === selectedNodeId ? "#164e63" : "#0a0f16")
      .attr("stroke", (d: LogicNode) => {
          if (d.id === selectedNodeId) return "#22d3ee";
          return d.status === 'active' ? "#06b6d4" : d.status === 'error' ? "#ef4444" : "#2b3a4a";
      })
      .attr("stroke-width", (d: LogicNode) => d.id === selectedNodeId ? 3 : 2)
      .attr("class", "transition-all duration-500 cursor-pointer hover:fill-cyan-900/40");

    // Node Glow (if active)
    node.filter((d: LogicNode) => d.status === 'active')
      .append("circle")
      .attr("r", 25)
      .attr("fill", "url(#glowGradient)") // We would need a gradient def, skipping for simplicity, using stroke shadow in CSS instead
      .attr("class", "animate-pulse opacity-20 fill-cyan-500 pointer-events-none");

    // Selected Indicator Ring
    node.filter((d: LogicNode) => d.id === selectedNodeId)
      .append("circle")
      .attr("r", 32)
      .attr("fill", "none")
      .attr("stroke", "#22d3ee")
      .attr("stroke-width", 1)
      .attr("stroke-dasharray", "4,4")
      .attr("class", "animate-spin-slow opacity-60 pointer-events-none");

    // Label
    node.append("text")
      .text((d: LogicNode) => d.label)
      .attr("dy", 35)
      .attr("text-anchor", "middle")
      .attr("fill", (d: LogicNode) => d.id === selectedNodeId ? "#e2e8f0" : "#94a3b8")
      .attr("font-family", "Fira Code")
      .attr("font-size", "10px")
      .style("pointer-events", "none");

    // Type Icon (Simple chars)
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

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
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

  }, [nodes, selectedNodeId]);

  return (
    <div className="w-full h-full bg-quantum-900 border border-quantum-600 rounded-lg overflow-hidden relative shadow-lg">
       <div className="absolute top-0 left-0 px-3 py-2 z-10 flex space-x-2">
        <span className="text-xs font-mono uppercase tracking-widest text-slate-500 bg-quantum-950/80 px-2 py-1 border border-quantum-600 rounded backdrop-blur">
            Logic Topology View
        </span>
      </div>
       {/* Blueprint grid background */}
       <div className="absolute inset-0 opacity-10 pointer-events-none" 
            style={{ 
                backgroundImage: 'linear-gradient(#2b3a4a 1px, transparent 1px), linear-gradient(90deg, #2b3a4a 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}>
       </div>
       <div className="absolute bottom-4 right-4 z-10 text-[10px] font-mono text-slate-600">
           INTERACTIVE MODE: ACTIVE
       </div>
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};