import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { aiNodes, humanCouncil, charterArticles, nodeConnections } from '@/data/byzantineEcosystem';
import { X, Zap, Info } from 'lucide-react';

interface NodePosition {
  x: number;
  y: number;
}

interface SelectedNode {
  id: string;
  type: 'ai' | 'human' | 'charter';
  data: any;
}

export default function ByzantineCouncilVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<SelectedNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<Record<string, NodePosition>>({});
  const [animationTime, setAnimationTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate positions for all nodes
  useEffect(() => {
    const positions: Record<string, NodePosition> = {};
    const centerX = 512;
    const centerY = 384;

    // CSOAI Center (0, 0)
    positions['center'] = { x: centerX, y: centerY };

    // Human Council - outer ring (5 members)
    humanCouncil.forEach((member, idx) => {
      const angle = (idx / humanCouncil.length) * Math.PI * 2;
      const radius = 120;
      positions[member.id] = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      };
    });

    // 33 AI Nodes - middle rings (organized by domain)
    aiNodes.forEach((node, idx) => {
      const ring = Math.floor(idx / 11); // 3 rings of 11 nodes
      const posInRing = idx % 11;
      const angle = (posInRing / 11) * Math.PI * 2 + (ring * Math.PI / 6); // Offset each ring
      const radius = 200 + ring * 50; // Increasing radius for each ring
      positions[node.id] = {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      };
    });

    setNodePositions(positions);
  }, []);

  // Animation loop for data flows
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTime(t => (t + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || Object.keys(nodePositions).length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw connections between nodes
    Object.entries(nodeConnections).forEach(([sourceId, targets]) => {
      const source = nodePositions[sourceId];
      if (!source) return;

      targets.forEach(targetId => {
        const target = nodePositions[targetId];
        if (!target) return;

        // Draw connection line with gradient
        const gradient = ctx.createLinearGradient(source.x, source.y, target.x, target.y);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
        gradient.addColorStop(0.5, 'rgba(34, 197, 94, 0.5)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.3)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();

        // Draw animated data flow particles
        const distance = Math.sqrt(
          Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2)
        );
        const flowProgress = (animationTime % 360) / 360;
        const particleX = source.x + (target.x - source.x) * flowProgress;
        const particleY = source.y + (target.y - source.y) * flowProgress;

        ctx.fillStyle = 'rgba(34, 197, 94, 0.8)';
        ctx.beginPath();
        ctx.arc(particleX, particleY, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    });

    // Draw charter article connections (lighter, less frequent)
    charterArticles.slice(0, 20).forEach((article, idx) => {
      if (idx % 3 !== 0) return; // Draw every 3rd article
      const angle = (idx / charterArticles.length) * Math.PI * 2;
      const radius = 340;
      const x = canvas.width / 2 + Math.cos(angle) * radius;
      const y = canvas.height / 2 + Math.sin(angle) * radius;

      // Connect to center with faint line
      ctx.strokeStyle = 'rgba(107, 114, 128, 0.2)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.lineTo(x, y);
      ctx.stroke();
    });

    // Draw human council nodes (outer ring)
    humanCouncil.forEach((member) => {
      const pos = nodePositions[member.id];
      if (!pos) return;

      // Glow effect
      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 20);
      gradient.addColorStop(0, member.color + '40');
      gradient.addColorStop(1, member.color + '00');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
      ctx.fill();

      // Node circle
      ctx.fillStyle = member.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Border
      ctx.strokeStyle = member.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Draw AI nodes
    aiNodes.forEach((node) => {
      const pos = nodePositions[node.id];
      if (!pos) return;

      const isHovered = hoveredNode === node.id;
      const size = isHovered ? 7 : 5;

      // Glow effect
      const glowRadius = isHovered ? 15 : 10;
      const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowRadius);
      gradient.addColorStop(0, node.color + '30');
      gradient.addColorStop(1, node.color + '00');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // Node circle
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
      ctx.fill();

      // Border
      if (isHovered) {
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // Draw center CSOAI node
    const centerPos = nodePositions['center'];
    if (centerPos) {
      // Pulsing glow
      const pulseSize = 30 + Math.sin(animationTime * Math.PI / 180) * 5;
      const gradient = ctx.createRadialGradient(
        centerPos.x, centerPos.y, 0,
        centerPos.x, centerPos.y, pulseSize
      );
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerPos.x, centerPos.y, pulseSize, 0, Math.PI * 2);
      ctx.fill();

      // Center circle
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(centerPos.x, centerPos.y, 12, 0, Math.PI * 2);
      ctx.fill();

      // Border
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(centerPos.x, centerPos.y, 12, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, [nodePositions, animationTime, hoveredNode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on a node
    for (const [id, pos] of Object.entries(nodePositions)) {
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (distance < 15) {
        const aiNode = aiNodes.find(n => n.id === id);
        if (aiNode) {
          setSelectedNode({ id, type: 'ai', data: aiNode });
          return;
        }

        const humanMember = humanCouncil.find(m => m.id === id);
        if (humanMember) {
          setSelectedNode({ id, type: 'human', data: humanMember });
          return;
        }
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let found = false;
    for (const [id, pos] of Object.entries(nodePositions)) {
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (distance < 15) {
        setHoveredNode(id);
        found = true;
        break;
      }
    }

    if (!found) {
      setHoveredNode(null);
    }
  };

  return (
    <div ref={containerRef} className="w-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700">
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={1024}
        height={768}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
        className="w-full cursor-pointer"
      />

      {/* Legend */}
      <div className="bg-slate-800/50 border-t border-slate-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-slate-300">33 AI Specialist Nodes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-slate-300">5 Human Council Members</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span className="text-slate-300">Dynamic Data Flows</span>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-2">Click on any node to view details • Hover to highlight</p>
      </div>

      {/* Detail Panel */}
      {selectedNode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 bg-slate-800 border border-emerald-500/50 rounded-lg p-6 max-w-sm shadow-2xl"
        >
          <button
            onClick={() => setSelectedNode(null)}
            className="absolute top-2 right-2 p-1 hover:bg-slate-700 rounded"
          >
            <X className="w-4 h-4" />
          </button>

          {selectedNode.type === 'ai' && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedNode.data.color }}
                ></div>
                <h3 className="font-bold text-white">{selectedNode.data.name}</h3>
              </div>
              <p className="text-xs text-emerald-400 mb-2">{selectedNode.data.domain}</p>
              <p className="text-sm text-slate-300 mb-3">{selectedNode.data.description}</p>
              <div>
                <p className="text-xs font-semibold text-slate-400 mb-2">Key Responsibilities:</p>
                <ul className="space-y-1">
                  {selectedNode.data.responsibilities.map((resp: string, i: number) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">•</span>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {selectedNode.type === 'human' && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedNode.data.color }}
                ></div>
                <h3 className="font-bold text-white">{selectedNode.data.name}</h3>
              </div>
              <p className="text-xs text-emerald-400 mb-2">{selectedNode.data.title}</p>
              <p className="text-sm text-slate-300">{selectedNode.data.organization}</p>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
