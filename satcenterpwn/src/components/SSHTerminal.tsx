import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { Lock, Terminal as TerminalIcon } from 'lucide-react';
import { io } from 'socket.io-client';
import { SSHConnection } from '../types';
import 'xterm/css/xterm.css';

interface Props {
  onConnect: (connection: SSHConnection) => void;
  onDisconnect: () => void;
}

export const SSHTerminal: React.FC<Props> = ({ onConnect, onDisconnect }) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const [socket, setSocket] = useState<any>(null);
  const [showForm, setShowForm] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connection, setConnection] = useState<SSHConnection>({
    host: '',
    username: '',
    password: '',
    port: 22
  });

  useEffect(() => {
    if (terminalRef.current && !terminal) {
      const term = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        theme: {
          background: '#1a1b26',
          foreground: '#a9b1d6',
          cursor: '#c0caf5'
        }
      });

      const fitAddon = new FitAddon();
      const webLinksAddon = new WebLinksAddon();

      term.loadAddon(fitAddon);
      term.loadAddon(webLinksAddon);
      term.open(terminalRef.current);
      fitAddon.fit();

      // Initialize socket connection
      const newSocket = io('http://localhost:3001', {
        transports: ['websocket']
      });

      newSocket.on('connect', () => {
        console.log('Socket connected');
      });

      newSocket.on('data', (data: string) => {
        term.write(data);
      });

      newSocket.on('disconnect', () => {
        term.write('\r\n\x1b[31mDisconnected from server\x1b[0m\r\n');
        setShowForm(true);
        setIsConnecting(false);
      });

      // Handle terminal input
      term.onData((data) => {
        if (socket) {
          socket.emit('data', data);
        }
      });

      setTerminal(term);
      setSocket(newSocket);

      return () => {
        term.dispose();
        newSocket.disconnect();
      };
    }
  }, [terminalRef.current]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!socket || !terminal) return;

    setIsConnecting(true);
    terminal.clear();
    terminal.write('Connecting to ' + connection.host + '...\r\n');

    socket.emit('ssh-connect', connection);

    socket.once('ssh-connected', () => {
      setShowForm(false);
      setIsConnecting(false);
      onConnect(connection);
      terminal.write('\r\n\x1b[32mConnected!\x1b[0m\r\n');
    });

    socket.once('ssh-error', (error: string) => {
      setIsConnecting(false);
      terminal.write(`\r\n\x1b[31mError: ${error}\x1b[0m\r\n`);
    });
  };

  const handleDisconnect = () => {
    if (socket) {
      socket.emit('ssh-disconnect');
      onDisconnect();
      setShowForm(true);
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-cyan-500/20 overflow-hidden">
      {showForm ? (
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <TerminalIcon className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-semibold text-white">SSH Terminal</h2>
          </div>

          <form onSubmit={handleConnect} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Host
              </label>
              <input
                type="text"
                value={connection.host}
                onChange={(e) => setConnection({ ...connection, host: e.target.value })}
                className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                placeholder="example.com"
                required
                disabled={isConnecting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={connection.username}
                  onChange={(e) => setConnection({ ...connection, username: e.target.value })}
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  required
                  disabled={isConnecting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Port
                </label>
                <input
                  type="number"
                  value={connection.port}
                  onChange={(e) => setConnection({ ...connection, port: parseInt(e.target.value) })}
                  className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  required
                  disabled={isConnecting}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={connection.password}
                onChange={(e) => setConnection({ ...connection, password: e.target.value })}
                className="w-full bg-black/40 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                required
                disabled={isConnecting}
              />
            </div>

            <button
              type="submit"
              disabled={isConnecting}
              className={`w-full ${
                isConnecting
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-600'
              } text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2`}
            >
              <Lock className="w-4 h-4" />
              {isConnecting ? 'Connecting...' : 'Connect'}
            </button>
          </form>
        </div>
      ) : (
        <div className="h-[400px] relative">
          <div ref={terminalRef} className="h-full" />
          <button
            onClick={handleDisconnect}
            className="absolute top-4 right-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1 rounded-lg text-sm transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};