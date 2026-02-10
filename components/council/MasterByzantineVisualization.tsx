
          {/* Pipeline nodes */}
          {pipelinePositions.map(category => (
            <g key={category.key}>
              {/* Category label */}
              <text
                x={category.labelX}
                y={category.labelY}
                textAnchor="middle"
                fill={category.color}
                fontSize="11"
                fontWeight="600"
                opacity="0.8"
              >
                {category.label}
              </text>
              
              {category.nodes.map(node => (
                <g
                  key={node.id}
                  onClick={() => handleNodeClick('pipeline', { ...node, category: category.label })}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={hoveredNode === node.id ? 16 : 12}
                    fill={node.color}
                    opacity={hoveredNode === node.id ? 1 : 0.7}
                    filter={hoveredNode === node.id ? "url(#nodeGlow)" : undefined}
                    className="transition-all duration-200"
                  />
                  {hoveredNode === node.id && (
                    <text
                      x={node.x}
                      y={node.y - 22}
                      textAnchor="middle"
                      fill="currentColor"
                      fontSize="10"
                      fontWeight="500"
                      className="pointer-events-none"
                    >
                      {node.name}
                    </text>
                  )}
                </g>
              ))}
            </g>
          ))}

          {/* Council member nodes */}
          {councilPositions.map((member, i) => (
            <g
              key={member.id}
              onClick={() => handleNodeClick('council', member)}
              onMouseEnter={() => setHoveredNode(`council-${member.id}`)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{ cursor: 'pointer' }}
            >
              <circle
                cx={member.x}
                cy={member.y}
                r={hoveredNode === `council-${member.id}` ? 12 : 8}
                fill={getVoteColor(member.id)}
                opacity={hoveredNode === `council-${member.id}` ? 1 : 0.8}
                filter={hoveredNode === `council-${member.id}` ? "url(#nodeGlow)" : undefined}
                className="transition-all duration-200"
              />
              {/* Small indicator showing agent number */}
              <text
                x={member.x}
                y={member.y + 3}
                textAnchor="middle"
                fill="white"
                fontSize="6"
                fontWeight="bold"
              >
                {member.id}
              </text>
              {hoveredNode === `council-${member.id}` && (
                <>
                  <text
                    x={member.x}
                    y={member.y - 18}
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="10"
                    fontWeight="600"
                    className="pointer-events-none"
                  >
                    {member.name}
                  </text>
                  <text
                    x={member.x}
                    y={member.y - 6}
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="8"