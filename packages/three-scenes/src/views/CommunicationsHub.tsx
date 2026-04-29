'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { FloatingPanel } from '../SpatialUI';
import { AvatarSystem } from '../AvatarSystem';

interface ConversationThread {
  id: string;
  name: string;
  avatarUrl?: string | null;
  lastMessage: string;
  unreadCount: number;
  isActive: boolean;
  participants: Array<{
    id: string;
    name: string;
    avatarUrl?: string | null;
  }>;
}

interface CommunicationsHubProps {
  conversations?: ConversationThread[];
  activeConversationId?: string | null;
  onConversationClick?: (conversationId: string) => void;
}

export function CommunicationsHub({
  conversations = [],
  activeConversationId,
  onConversationClick,
}: CommunicationsHubProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredConversation, setHoveredConversation] = useState<string | null>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.03) * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Title */}
      <Text position={[0, 4, 0]} fontSize={0.5} color="#e8e4ff" anchorX="center" fontWeight="bold">
        Communications Hub
      </Text>

      {/* Conversation threads */}
      {conversations.map((conversation, i) => {
        const angle = (i / Math.max(conversations.length, 1)) * Math.PI * 2;
        const radius = 3;
        const isActive = conversation.id === activeConversationId;
        const isHovered = conversation.id === hoveredConversation;

        return (
          <Float
            key={conversation.id}
            speed={1.5}
            rotationIntensity={0.2}
            floatIntensity={0.3}
          >
            <group
              position={[
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius,
              ]}
              onClick={() => onConversationClick?.(conversation.id)}
              onPointerOver={() => setHoveredConversation(conversation.id)}
              onPointerOut={() => setHoveredConversation(null)}
            >
              {/* Thread orb */}
              <mesh>
                <sphereGeometry args={[isActive ? 0.6 : 0.4, 32, 32]} />
                <meshStandardMaterial
                  color={isActive ? '#00f5ff' : isHovered ? '#7b2fff' : '#1e1b4b'}
                  emissive={isActive ? '#00f5ff' : isHovered ? '#7b2fff' : '#0d0a2e'}
                  emissiveIntensity={isActive ? 0.6 : 0.3}
                  transparent
                  opacity={0.9}
                />
              </mesh>

              {/* Unread indicator */}
              {conversation.unreadCount > 0 && (
                <mesh position={[0.3, 0.3, 0]}>
                  <sphereGeometry args={[0.15, 16, 16]} />
                  <meshBasicMaterial color="#ff2fa0" />
                </mesh>
              )}

              {/* Conversation info */}
              {(isActive || isHovered) && (
                <FloatingPanel position={[0, 1.2, 0]} width="220px">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h4 style={{ margin: 0, color: '#e8e4ff', fontSize: '16px' }}>
                      {conversation.name}
                    </h4>
                    <p style={{ margin: 0, color: '#9b94c4', fontSize: '13px', lineHeight: 1.4 }}>
                      {conversation.lastMessage}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span style={{
                        background: '#ff2fa0',
                        color: '#fff',
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        alignSelf: 'flex-start',
                      }}>
                        {conversation.unreadCount} new
                      </span>
                    )}
                  </div>
                </FloatingPanel>
              )}

              {/* Participant avatars */}
              <group position={[0, -0.8, 0]}>
                {conversation.participants.slice(0, 3).map((participant, j) => (
                  <group key={participant.id} position={[(j - 1) * 0.5, 0, 0]}>
                    <AvatarSystem
                      userId={participant.id}
                      name={participant.name}
                      avatarUrl={participant.avatarUrl}
                      color="#7b2fff"
                      size={0.2}
                    />
                  </group>
                ))}
                {conversation.participants.length > 3 && (
                  <Text position={[0.8, 0, 0]} fontSize={0.15} color="#9b94c4">
                    +{conversation.participants.length - 3}
                  </Text>
                )}
              </group>
            </group>
          </Float>
        );
      })}

      {/* Active conversation panel */}
      {activeConversationId && (
        <group position={[0, 0, -4]}>
          <FloatingPanel width="400px">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflow: 'auto' }}>
              <h3 style={{ margin: 0, color: '#00f5ff' }}>Active Conversation</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Message bubbles would be rendered here */}
                <div style={{
                  background: 'rgba(0, 245, 255, 0.1)',
                  padding: '12px',
                  borderRadius: '12px 12px 12px 0',
                  alignSelf: 'flex-start',
                }}>
                  <p style={{ margin: 0, color: '#e8e4ff', fontSize: '14px' }}>
                    Hello! I'm interested in your project.
                  </p>
                </div>
                <div style={{
                  background: 'rgba(123, 47, 255, 0.1)',
                  padding: '12px',
                  borderRadius: '12px 12px 0 12px',
                  alignSelf: 'flex-end',
                }}>
                  <p style={{ margin: 0, color: '#e8e4ff', fontSize: '14px' }}>
                    Great! Let's discuss the details.
                  </p>
                </div>
              </div>
            </div>
          </FloatingPanel>
        </group>
      )}

      {/* Background ambient particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Float key={i} speed={0.5} rotationIntensity={0} floatIntensity={0.5}>
          <mesh position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
          ]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#7b2fff" transparent opacity={0.3} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export type { CommunicationsHubProps };
