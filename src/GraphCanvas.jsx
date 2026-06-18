// D:\AxiomGraphPro\axiom-frontend\src\GraphCanvas.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html, Line } from '@react-three/drei';

function NodeMesh({ node, onSelectNode, onDoubleClickNode, isSelected, commitTimelineIndex }) {
  const meshRef = useRef();

  // 1. Simulate evolution properties based on Git Commit Timeline Index
  const historicalVisibility = useMemo(() => {
    // Generates a deterministically stable timeline entry signature assignment
    const pseudoSpawnIndex = (node.id.length * 3 + node.cluster.length) % 100;
    const isSpawned = pseudoSpawnIndex <= commitTimelineIndex;
    const targetScale = isSpawned ? (isSelected ? 1.6 : 1.0) : 0.0;
    const opacity = isSpawned ? 1.0 : 0.15;
    return { targetScale, opacity, isSpawned };
  }, [node.id, node.cluster, commitTimelineIndex, isSelected]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    if (historicalVisibility.targetScale === 0) {
      meshRef.current.scale.set(0, 0, 0);
      return;
    }
    const t = state.clock.getElapsedTime();
    
    // Smooth architectural morph matrix scaling interpolations
    const currentScale = meshRef.current.scale.x;
    const targetScale = historicalVisibility.targetScale;
    const newScale = currentScale + (targetScale - currentScale) * 0.1;
    meshRef.current.scale.set(newScale, newScale, newScale);
    
    meshRef.current.position.y = node.position[1] + Math.sin(t * 1.2 + node.id.length) * 0.04;
  });

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelectNode(node);
        }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshStandardMaterial
          color={isSelected ? "#38bdf8" : node.cluster === "Root" ? "#06b6d4" : "#a855f7"}
          emissive={isSelected ? "#38bdf8" : node.cluster === "Root" ? "#06b6d4" : "#a855f7"}
          emissiveIntensity={isSelected ? 2.5 : 0.6}
          wireframe={!isSelected}
          transparent
          opacity={historicalVisibility.opacity}
        />
      </mesh>

      {historicalVisibility.isSpawned && (
        <Html distanceFactor={14} position={[0, 0.55, 0]} center pointerEvents="none">
          <div 
            onDoubleClick={(e) => {
              e.stopPropagation();
              onDoubleClickNode(node);
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wide transition-all border shadow-2xl select-none cursor-pointer whitespace-nowrap pointer-events-auto
              ${isSelected 
                ? 'bg-sky-950 text-sky-400 border-sky-400 scale-105 z-20' 
                : 'bg-gray-900/95 text-cyan-400 border-cyan-800/80 hover:border-cyan-400'
              }`}
          >
            {node.id}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function GraphCanvas({ graphData, selectedNode, onSelectNode, onDoubleClickNode, commitTimelineIndex }) {
  const nodesWithPositions = useMemo(() => {
    const nodes = graphData?.nodes || [];
    if (nodes.length === 0) return [];
    
    return nodes.map((node, index) => {
      const angle = index * 1.35; 
      const radius = 4 + (index * 0.4); 
      const yHeight = ((index % 4) - 1.5) * 2.2;

      return {
        ...node,
        position: [
          Math.cos(angle) * radius,
          yHeight,
          Math.sin(angle) * radius
        ]
      };
    });
  }, [graphData?.nodes]);

  const nodeMap = useMemo(() => {
    const map = {};
    nodesWithPositions.forEach(node => {
      map[node.id] = node.position;
    });
    return map;
  }, [nodesWithPositions]);

  const connectionLines = useMemo(() => {
    const lines = [];
    if (!graphData?.links || !graphData?.nodes) return lines;

    graphData.links.forEach((link, idx) => {
      const start = nodeMap[link.source];
      const end = nodeMap[link.target];
      if (start && end) {
        // Only render vectors if both ends are currently active/spawned in history frame
        const srcNode = graphData.nodes.find(n => n.id === link.source);
        const tgtNode = graphData.nodes.find(n => n.id === link.target);
        
        const srcSpawnIdx = srcNode ? (srcNode.id.length * 3 + srcNode.cluster.length) % 100 : 0;
        const tgtSpawnIdx = tgtNode ? (tgtNode.id.length * 3 + tgtNode.cluster.length) % 100 : 0;
        
        if (srcSpawnIdx <= commitTimelineIndex && tgtSpawnIdx <= commitTimelineIndex) {
          lines.push({
            id: `link-${idx}`,
            points: [start, end]
          });
        }
      }
    });
    return lines;
  }, [graphData?.links, graphData?.nodes, nodeMap, commitTimelineIndex]);

  return (
    <div className="w-full h-full absolute inset-0 z-0 bg-gray-950">
      <Canvas camera={{ position: [0, 8, 15], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <pointLight position={[20, 20, 20]} intensity={1.8} />
        <Stars radius={90} depth={40} count={1000} factor={4} saturation={0.5} fade speed={1} />
        
        {connectionLines.map((line) => (
          <Line
            key={line.id}
            points={line.points}
            color="#22d3ee"
            lineWidth={1.5}
            transparent
            opacity={0.4}
          />
        ))}

        {nodesWithPositions.map((node) => (
          <NodeMesh
            key={node.id}
            node={node}
            isSelected={selectedNode?.id === node.id}
            onSelectNode={onSelectNode}
            onDoubleClickNode={onDoubleClickNode}
            commitTimelineIndex={commitTimelineIndex}
          />
        ))}

        <OrbitControls enableDamping dampingFactor={0.05} maxDistance={35} minDistance={3} />
      </Canvas>
      
      {/* Footer Credit */}
      <div className="absolute bottom-3 right-4 text-[10px] text-cyan-500/40 font-mono tracking-wider select-none pointer-events-none z-10">
        © Talal Ashraf
      </div>
    </div>
  );
}