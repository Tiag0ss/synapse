import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { authenticateSession, AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';
import {
  toolCreateAgentDoc,
  toolCreateIndex,
  toolCreateNote,
  toolDeleteAgentDoc,
  toolDeleteNote,
  toolGetAgentDoc,
  toolGetNote,
  toolGetNoteContext,
  toolGetNoteTasks,
  toolGetTaskContext,
  toolListAgentDocs,
  toolListNotes,
  toolListVaults,
  toolRefreshIndex,
  toolUpdateAgentDoc,
  toolUpdateNote,
  type McpToolContext,
} from './toolHandlers';

const router = Router();

const vaultIdShape = { vaultId: z.union([z.number(), z.string()]) };

function ctxFromReq(req: AuthRequest): McpToolContext {
  return { userId: req.user!.userId };
}

function createServerForRequest(req: AuthRequest): McpServer {
  const server = new McpServer({ name: 'synapse', version: '1.0.0' });

  const run = async (
    name: string,
    fn: () => Promise<{ content: { type: 'text'; text: string }[]; isError?: boolean }>
  ) => {
    try {
      const result = await fn();
      logger.info('MCP tool finished', {
        tool: name,
        userId: req.user?.userId,
        isError: !!result.isError,
      });
      return result;
    } catch (error) {
      logger.error('MCP tool failed', {
        tool: name,
        userId: req.user?.userId,
        error: error instanceof Error ? error.message : String(error),
      });
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify({
              success: false,
              message: error instanceof Error ? error.message : 'Tool failed',
            }),
          },
        ],
        isError: true,
      };
    }
  };

  server.registerTool(
    'list_vaults',
    { description: 'List Synapse vaults accessible to the authenticated user (owner or edit member).', inputSchema: {} },
    async () => run('list_vaults', () => toolListVaults(ctxFromReq(req)))
  );

  server.registerTool(
    'list_notes',
    {
      description: 'List notes in a vault (id, title, path, kind, visibility, Myelin task link).',
      inputSchema: { ...vaultIdShape, includeTrash: z.boolean().optional() },
    },
    async (args) => run('list_notes', () => toolListNotes(ctxFromReq(req), args as Record<string, unknown>))
  );

  server.registerTool(
    'get_note',
    {
      description: 'Get one note by noteId or path (active notes only).',
      inputSchema: { ...vaultIdShape, noteId: z.union([z.number(), z.string()]).optional(), path: z.string().optional() },
    },
    async (args) => run('get_note', () => toolGetNote(ctxFromReq(req), args as Record<string, unknown>))
  );

  server.registerTool(
    'create_note',
    {
      description: 'Create a note in a vault. path is derived from title when omitted.',
      inputSchema: {
        ...vaultIdShape,
        title: z.string(),
        path: z.string().optional(),
        bodyMarkdown: z.string().optional(),
        kind: z.enum(['note', 'whiteboard']).optional(),
      },
    },
    async (args) => run('create_note', () => toolCreateNote(ctxFromReq(req), args as Record<string, unknown>))
  );

  server.registerTool(
    'update_note',
    {
      description: 'Update a note (title/path/bodyMarkdown). Omit a field to leave it unchanged.',
      inputSchema: {
        ...vaultIdShape,
        noteId: z.union([z.number(), z.string()]),
        title: z.string().optional(),
        path: z.string().optional(),
        bodyMarkdown: z.string().optional(),
      },
    },
    async (args) => run('update_note', () => toolUpdateNote(ctxFromReq(req), args as Record<string, unknown>))
  );

  server.registerTool(
    'delete_note',
    {
      description: 'Delete a note (soft trash by default; hard true permanently deletes).',
      inputSchema: { ...vaultIdShape, noteId: z.union([z.number(), z.string()]), hard: z.boolean().optional() },
    },
    async (args) => run('delete_note', () => toolDeleteNote(ctxFromReq(req), args as Record<string, unknown>))
  );

  server.registerTool(
    'get_note_tasks',
    {
      description:
        'Checkbox / YAML-todo tasks for one note, each with its Myelin task link (pmTaskId/pmProjectId) when pushed.',
      inputSchema: { ...vaultIdShape, noteId: z.union([z.number(), z.string()]) },
    },
    async (args) => run('get_note_tasks', () => toolGetNoteTasks(ctxFromReq(req), args as Record<string, unknown>))
  );

  server.registerTool(
    'get_note_context',
    {
      description:
        'Note body plus the bodies of notes it links to ([[wikilinks]]/mentions) and notes that link back to it.',
      inputSchema: { ...vaultIdShape, noteId: z.union([z.number(), z.string()]) },
    },
    async (args) =>
      run('get_note_context', () => toolGetNoteContext(ctxFromReq(req), args as Record<string, unknown>))
  );

  server.registerTool(
    'get_task_context',
    {
      description:
        'Myelin task context: resolves the Synapse note(s)/checkbox linked to pmTaskId (or a given noteId/markerId), with note body + linked notes.',
      inputSchema: {
        ...vaultIdShape,
        pmTaskId: z.union([z.number(), z.string()]).optional(),
        noteId: z.union([z.number(), z.string()]).optional(),
        markerId: z.string().optional(),
      },
    },
    async (args) =>
      run('get_task_context', () => toolGetTaskContext(ctxFromReq(req), args as Record<string, unknown>))
  );

  const docIdentifierShape = {
    ...vaultIdShape,
    id: z.union([z.number(), z.string()]).optional(),
    slug: z.string().optional(),
  };

  server.registerTool(
    'list_skills',
    { description: 'List agent skills stored on this vault.', inputSchema: vaultIdShape },
    async (args) => run('list_skills', () => toolListAgentDocs(ctxFromReq(req), args as Record<string, unknown>, 'skill'))
  );
  server.registerTool(
    'get_skill',
    { description: 'Get one vault agent skill by id or slug.', inputSchema: docIdentifierShape },
    async (args) => run('get_skill', () => toolGetAgentDoc(ctxFromReq(req), args as Record<string, unknown>, 'skill'))
  );
  server.registerTool(
    'list_rules',
    { description: 'List agent rules stored on this vault.', inputSchema: vaultIdShape },
    async (args) => run('list_rules', () => toolListAgentDocs(ctxFromReq(req), args as Record<string, unknown>, 'rule'))
  );
  server.registerTool(
    'get_rule',
    { description: 'Get one vault agent rule by id or slug.', inputSchema: docIdentifierShape },
    async (args) => run('get_rule', () => toolGetAgentDoc(ctxFromReq(req), args as Record<string, unknown>, 'rule'))
  );

  const createDocShape = { ...vaultIdShape, name: z.string(), content: z.string().optional() };
  const updateDocShape = {
    ...vaultIdShape,
    id: z.union([z.number(), z.string()]),
    name: z.string().optional(),
    content: z.string().optional(),
  };
  const deleteDocShape = { ...vaultIdShape, id: z.union([z.number(), z.string()]) };

  server.registerTool(
    'create_skill',
    { description: 'Create a vault agent skill.', inputSchema: createDocShape },
    async (args) =>
      run('create_skill', () => toolCreateAgentDoc(ctxFromReq(req), args as Record<string, unknown>, 'skill'))
  );
  server.registerTool(
    'update_skill',
    { description: 'Update a vault agent skill.', inputSchema: updateDocShape },
    async (args) =>
      run('update_skill', () => toolUpdateAgentDoc(ctxFromReq(req), args as Record<string, unknown>, 'skill'))
  );
  server.registerTool(
    'delete_skill',
    { description: 'Delete a vault agent skill.', inputSchema: deleteDocShape },
    async (args) =>
      run('delete_skill', () => toolDeleteAgentDoc(ctxFromReq(req), args as Record<string, unknown>, 'skill'))
  );
  server.registerTool(
    'create_rule',
    { description: 'Create a vault agent rule.', inputSchema: createDocShape },
    async (args) =>
      run('create_rule', () => toolCreateAgentDoc(ctxFromReq(req), args as Record<string, unknown>, 'rule'))
  );
  server.registerTool(
    'update_rule',
    { description: 'Update a vault agent rule.', inputSchema: updateDocShape },
    async (args) =>
      run('update_rule', () => toolUpdateAgentDoc(ctxFromReq(req), args as Record<string, unknown>, 'rule'))
  );
  server.registerTool(
    'delete_rule',
    { description: 'Delete a vault agent rule.', inputSchema: deleteDocShape },
    async (args) =>
      run('delete_rule', () => toolDeleteAgentDoc(ctxFromReq(req), args as Record<string, unknown>, 'rule'))
  );

  server.registerTool(
    'create_index',
    {
      description: 'Ensure the vault root index.md exists (aggregates all notes as wikilinks, grouped by folder).',
      inputSchema: { ...vaultIdShape, force: z.boolean().optional() },
    },
    async (args) => run('create_index', () => toolCreateIndex(ctxFromReq(req), args as Record<string, unknown>))
  );
  server.registerTool(
    'refresh_index',
    {
      description: 'Rebuild the vault root index.md from the current note list.',
      inputSchema: vaultIdShape,
    },
    async (args) => run('refresh_index', () => toolRefreshIndex(ctxFromReq(req), args as Record<string, unknown>))
  );

  return server;
}

async function handleMcp(req: AuthRequest, res: Response, _next: NextFunction): Promise<void> {
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  const server = createServerForRequest(req);
  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    logger.error('MCP HTTP handler failed', {
      userId: req.user?.userId,
      error: error instanceof Error ? error.message : String(error),
    });
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: { code: -32603, message: 'Internal MCP error' },
        id: null,
      });
    }
  } finally {
    try {
      await server.close();
    } catch {
      /* ignore */
    }
  }
}

router.all('/', authenticateSession, (req, res, next) => {
  void handleMcp(req as AuthRequest, res, next);
});

export default router;
