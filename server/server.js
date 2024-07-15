const express = require('express');
const WebSocket = require('ws');

const app = express();
const port = 3001;

const server = app.listen(port, () => {
    console.log(`Express server is running on http://localhost:${port}`);
});

const wss = new WebSocket.Server({ server });

const groups = {};

// Helper function to broadcast a message to all members of a group
const broadcastToGroup = (groupId, message) => {
    const group = groups[groupId];
    if (group) {
        group.forEach(ws => ws.send(message));
    }
};

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);

            switch (data.type) {
                case 'createGroup':
                    if (!groups[data.groupId]) {
                        groups[data.groupId] = new Set();
                        groups[data.groupId].add(ws);
                        ws.groupId = data.groupId;
                        ws.userId = data.userId;
                        ws.send(JSON.stringify({ type: 'createGroup', status: 'success', groupId: data.groupId }));
                    } else {
                        ws.send(JSON.stringify({ type: 'createGroup', status: 'alreadyExist', groupId: data.groupId }));
                    }
                    break;

                case 'joinGroup':
                    if (groups[data.groupId]) {
                        groups[data.groupId].add(ws);
                        ws.groupId = data.groupId;
                        ws.userId = data.userId;
                        ws.send(JSON.stringify({ type: 'joinGroup', status: 'success', groupId: data.groupId }));
                    } else {
                        ws.send(JSON.stringify({ type: 'joinGroup', status: 'error', message: 'Group does not exist' }));
                    }
                    break;

                case 'leaveGroup':
                    if (groups[data.groupId]) {
                        groups[data.groupId].delete(ws);
                        ws.send(JSON.stringify({ type: 'leaveGroup', status: 'success', groupId: data.groupId }));
                        if (groups[data.groupId].size === 0) {
                            delete groups[data.groupId];
                        }
                    } else {
                        ws.send(JSON.stringify({ type: 'leaveGroup', status: 'error', message: 'Group does not exist' }));
                    }
                    break;

                case 'message':
                    console.log("receive Message")
                    ws.send(JSON.stringify({ type: 'message', status: 'loading', message: 'get Message' }));
                    console.log("receive Message2")
                    if (ws.groupId) {
                        const outgoingMessage = JSON.stringify({ type: 'message', userId: ws.userId, message: data.message });
                        broadcastToGroup(ws.groupId, outgoingMessage);
                    } else {
                        ws.send(JSON.stringify({ type: 'message', status: 'error', message: 'You are not in a group' }));
                    }
                    break;

                default:
                    ws.send(JSON.stringify({ type: 'error', message: 'Unknown command' }));
                    break;
            }
        } catch (error) {
            ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
        }
    });

    ws.on('close', () => {
        if (ws.groupId && groups[ws.groupId]) {
            groups[ws.groupId].delete(ws);
            if (groups[ws.groupId].size === 0) {
                delete groups[ws.groupId];
            }
        }
    });
});

app.get('/', (req, res) => {
    res.send('Hello World! WebSocket server with group functionality is running.');
});