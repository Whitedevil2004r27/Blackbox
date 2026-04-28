"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const PORT = parseInt(process.env.REALTIME_PORT || '4001');
const HOST = process.env.REALTIME_HOST || '0.0.0.0';
const httpServer = (0, http_1.createServer)();
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
exports.io = io;
// Room tracking: projectId -> Set<socketId>
const projectRooms = new Map();
// User tracking: userId -> socketId
const userSockets = new Map();
io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    // Authenticate socket (extract userId from auth token)
    socket.on('authenticate', (data) => {
        if (!data.userId) {
            socket.emit('error', { message: 'Authentication required' });
            return;
        }
        userSockets.set(data.userId, socket.id);
        socket.data.userId = data.userId;
        socket.emit('authenticated', { success: true, userId: data.userId });
        console.log(`Socket ${socket.id} authenticated as user ${data.userId}`);
    });
    // Join a project workspace room
    socket.on('join-project', (data) => {
        const { projectId } = data;
        const userId = socket.data.userId;
        if (!userId) {
            socket.emit('error', { message: 'Must authenticate before joining project' });
            return;
        }
        socket.join(`project:${projectId}`);
        if (!projectRooms.has(projectId)) {
            projectRooms.set(projectId, new Set());
        }
        projectRooms.get(projectId).add(socket.id);
        // Notify others in the room
        socket.to(`project:${projectId}`).emit('user-joined', { userId, projectId });
        socket.emit('joined-project', { projectId, userId });
        console.log(`User ${userId} joined project ${projectId}`);
    });
    // Leave a project workspace room
    socket.on('leave-project', (data) => {
        const { projectId } = data;
        const userId = socket.data.userId;
        socket.leave(`project:${projectId}`);
        projectRooms.get(projectId)?.delete(socket.id);
        socket.to(`project:${projectId}`).emit('user-left', { userId, projectId });
        socket.emit('left-project', { projectId });
    });
    // Send message in a project chat or direct conversation
    socket.on('send-message', (data) => {
        const userId = socket.data.userId;
        if (!userId) {
            socket.emit('error', { message: 'Must authenticate to send messages' });
            return;
        }
        const message = {
            id: crypto.randomUUID(),
            conversationId: data.conversationId,
            senderId: userId,
            content: data.content,
            type: data.type || 'text',
            replyToId: data.replyToId || null,
            createdAt: new Date().toISOString(),
        };
        // Emit to all members in the conversation room
        io.to(`conversation:${data.conversationId}`).emit('new-message', message);
    });
    // Join a conversation room
    socket.on('join-conversation', (data) => {
        socket.join(`conversation:${data.conversationId}`);
        socket.emit('joined-conversation', { conversationId: data.conversationId });
    });
    // Leave a conversation room
    socket.on('leave-conversation', (data) => {
        socket.leave(`conversation:${data.conversationId}`);
        socket.emit('left-conversation', { conversationId: data.conversationId });
    });
    // Typing indicator
    socket.on('typing', (data) => {
        const userId = socket.data.userId;
        socket.to(`conversation:${data.conversationId}`).emit('user-typing', {
            userId,
            conversationId: data.conversationId,
            isTyping: data.isTyping,
        });
    });
    // Task board updates (Kanban drag/drop, status changes)
    socket.on('task-update', (data) => {
        const userId = socket.data.userId;
        if (!userId)
            return;
        io.to(`project:${data.projectId}`).emit('task-updated', {
            taskId: data.taskId,
            updates: data.updates,
            updatedBy: userId,
        });
    });
    // New task created
    socket.on('task-created', (data) => {
        const userId = socket.data.userId;
        if (!userId)
            return;
        io.to(`project:${data.projectId}`).emit('task-created', {
            task: data.task,
            createdBy: userId,
        });
    });
    // Notification broadcast (server-to-client or client triggers)
    socket.on('notification', (data) => {
        const recipientSocketId = userSockets.get(data.recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('new-notification', {
                id: crypto.randomUUID(),
                type: data.type,
                title: data.title,
                body: data.body,
                data: data.data || {},
                createdAt: new Date().toISOString(),
            });
        }
    });
    // Proposal events
    socket.on('proposal-submitted', (data) => {
        io.to(`project:${data.projectId}`).emit('new-proposal', {
            proposalId: data.proposalId,
            projectId: data.projectId,
        });
    });
    // Contract events
    socket.on('contract-signed', (data) => {
        io.to(`project:${data.projectId}`).emit('contract-signed', {
            contractId: data.contractId,
            projectId: data.projectId,
        });
    });
    // Payment events
    socket.on('payment-released', (data) => {
        io.to(`project:${data.projectId}`).emit('payment-released', {
            paymentId: data.paymentId,
            projectId: data.projectId,
        });
    });
    // Handle disconnect
    socket.on('disconnect', () => {
        const userId = socket.data.userId;
        if (userId) {
            userSockets.delete(userId);
        }
        // Clean up project rooms
        for (const [projectId, sockets] of projectRooms.entries()) {
            if (sockets.has(socket.id)) {
                sockets.delete(socket.id);
                socket.to(`project:${projectId}`).emit('user-left', { userId, projectId });
                if (sockets.size === 0) {
                    projectRooms.delete(projectId);
                }
            }
        }
        console.log(`Socket disconnected: ${socket.id}`);
    });
});
httpServer.listen(PORT, HOST, () => {
    console.log(`FreelanceX Realtime Service running on ws://${HOST}:${PORT}`);
});
