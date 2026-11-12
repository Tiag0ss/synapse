export type PlannerStatusTone = 'todo' | 'progress' | 'done' | 'cancelled';

export type PlannerLinkItem = {
  markerId: string | null;
  openUrl: string | null;
  pmTaskId?: number | null;
  statusName?: string | null;
  statusTone?: PlannerStatusTone | null;
};

/**
 * Attach “Open in Planner” links next to markdown checkboxes that have a PM task.
 * Markers come from `<span class="synapse-cb-marker" data-marker-id="…">` in rendered HTML.
 */
export function applyPlannerButtons(root: HTMLElement, items: PlannerLinkItem[]): void {
  root.querySelectorAll('a.synapse-open-planner').forEach((el) => el.remove());
  root.querySelectorAll('span.synapse-pm-status').forEach((el) => el.remove());
  root.querySelectorAll('li.synapse-pm-tone-todo, li.synapse-pm-tone-progress, li.synapse-pm-tone-done, li.synapse-pm-tone-cancelled').forEach((el) => {
    el.classList.remove(
      'synapse-pm-tone-todo',
      'synapse-pm-tone-progress',
      'synapse-pm-tone-done',
      'synapse-pm-tone-cancelled'
    );
  });

  const byMarker = new Map<string, PlannerLinkItem>();
  for (const item of items) {
    if (item.markerId) byMarker.set(item.markerId, item);
  }
  if (!byMarker.size) return;

  root.querySelectorAll<HTMLElement>('.synapse-cb-marker[data-marker-id]').forEach((marker) => {
    const id = marker.getAttribute('data-marker-id');
    if (!id) return;
    const link = byMarker.get(id);
    if (!link) return;

    const li = marker.closest('li');
    if (!li) return;

    if (link.statusTone) {
      li.classList.add(`synapse-pm-tone-${link.statusTone}`);
    }

    if (link.statusName && !li.querySelector('span.synapse-pm-status')) {
      const badge = document.createElement('span');
      badge.className = `synapse-pm-status${link.statusTone ? ` is-${link.statusTone}` : ''}`;
      badge.textContent = link.statusName;
      li.appendChild(document.createTextNode(' '));
      li.appendChild(badge);
    }

    if (!link.openUrl || li.querySelector('a.synapse-open-planner')) return;

    const a = document.createElement('a');
    a.className = 'synapse-open-planner';
    a.href = link.openUrl;
    a.target = '_blank';
    a.rel = 'noreferrer';
    a.title = link.pmTaskId ? `Open task #${link.pmTaskId} in Myelin` : 'Open in Myelin';
    a.textContent = link.pmTaskId ? `Planner #${link.pmTaskId}` : 'Open in Planner';
    li.appendChild(document.createTextNode(' '));
    li.appendChild(a);
  });
}
