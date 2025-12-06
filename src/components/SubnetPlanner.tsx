import { useMemo, useState } from 'react';
import { ChevronDown, Eye, EyeOff, Leaf, Map, RefreshCcw, Shield, Sparkles } from 'lucide-react';
import type { ExplicitStatus, SubnetNode, SubnetTree } from '../types/subnetTree';
import { defaultPlanConfig } from '../config/samplePlan';
import { buildSubnetTree, calculateStatusTotals, getFreeBlocks, updateNodeStatus } from '../utils/subnetTree';

const STATUS_STYLES: Record<string, string> = {
  IN_USE: 'bg-slate-200 text-slate-900 border-slate-300',
  FREE: 'bg-slate-100 text-slate-800 border-slate-300',
  RESERVED: 'bg-slate-50 text-slate-700 border-slate-300',
  UNAVAILABLE: 'bg-slate-50 text-slate-500 border-slate-200',
  PARTIAL: 'bg-[repeating-linear-gradient(135deg,#e2e8f0_0,#e2e8f0_12px,#f8fafc_12px,#f8fafc_24px)] text-slate-800 border-slate-300'
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[status] || STATUS_STYLES.UNAVAILABLE}`}>
      {status}
    </span>
  );
}

function SubnetPlanner() {
  const [tree, setTree] = useState<SubnetTree>(() => buildSubnetTree(defaultPlanConfig));
  const [hideUnavailable, setHideUnavailable] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const totals = useMemo(() => calculateStatusTotals(tree), [tree]);
  const freeBlocks = useMemo(() => getFreeBlocks(tree, [24, 25, 26]), [tree]);

  const toggleCollapse = (nodeId: string) => {
    setCollapsed((prev) => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const handleStatusChange = (nodeId: string, status: ExplicitStatus) => {
    setTree((prev) => updateNodeStatus(prev, nodeId, status, true));
  };

  const formatPercent = (value: number) => {
    if (totals.total === 0) return '0%';
    return `${((value / totals.total) * 100).toFixed(1)}%`;
  };

  const renderNode = (node: SubnetNode, depth = 0) => {
    if (!node) return null;
    if (hideUnavailable && node.effectiveStatus === 'UNAVAILABLE') return null;

    const hasChildren = node.children.length > 0;
    const isCollapsed = collapsed[node.id];
    const dimUnavailable = node.effectiveStatus === 'UNAVAILABLE' && hideUnavailable;

    return (
      <div key={node.id} className={`rounded-xl border p-3 ${dimUnavailable ? 'opacity-40' : ''}`}>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            {hasChildren ? (
              <button
                onClick={() => toggleCollapse(node.id)}
                className="w-7 h-7 inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                aria-label={isCollapsed ? 'Expand subnet' : 'Collapse subnet'}
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
              </button>
            ) : (
              <div className="w-7 h-7 inline-flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500">
                <Leaf className="w-4 h-4" />
              </div>
            )}

            <div className="flex flex-col">
              <span className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">{node.network}/{node.prefix}</span>
              <span className="text-xs text-slate-600 dark:text-slate-400">IPs: {node.totalIPs.toLocaleString()}</span>
            </div>

            <StatusBadge status={node.effectiveStatus} />

            {node.explicitStatus && (
              <span className="text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Explicit: {node.explicitStatus}
              </span>
            )}

            <div className="ml-auto flex gap-1">
              {(['IN_USE', 'FREE', 'RESERVED', 'UNAVAILABLE'] as ExplicitStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(node.id, status)}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold border transition hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-1 dark:focus:ring-offset-slate-900 ${
                    STATUS_STYLES[status]
                  }`}
                  title={`Mark ${node.network}/${node.prefix} as ${status}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {hasChildren && !isCollapsed && (
          <div className="mt-3 ml-5 border-l border-dashed border-slate-200 dark:border-slate-700 pl-4 space-y-2">
            {node.children.map((childId) => renderNode(tree.nodes[childId], depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const rootNode = tree.nodes[tree.rootId];

  return (
    <div className="subnet-card mt-10 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
            <Map className="w-5 h-5 text-slate-800 dark:text-slate-100" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">IPAM-lite Planner</div>
            <div className="text-xs text-gray-600 dark:text-slate-400">Root: {defaultPlanConfig.rootCidr} " Min prefix /{defaultPlanConfig.minPrefix}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTree(buildSubnetTree(defaultPlanConfig))}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            <RefreshCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={() => setHideUnavailable(!hideUnavailable)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-1 focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            {hideUnavailable ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {hideUnavailable ? 'Show All' : 'Hide Unavailable'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl border bg-white dark:bg-slate-900/50 flex flex-col gap-2 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300 text-xs">
            <Shield className="w-4 h-4 text-slate-800 dark:text-slate-100" />
            Address Totals
          </div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{totals.total.toLocaleString()} IPs</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="text-red-700 dark:text-red-400 font-semibold">In Use</div>
              <div className="text-slate-700 dark:text-slate-300">{totals.IN_USE.toLocaleString()} " {formatPercent(totals.IN_USE)}</div>
            </div>
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="text-green-700 dark:text-green-400 font-semibold">Free</div>
              <div className="text-slate-700 dark:text-slate-300">{totals.FREE.toLocaleString()} " {formatPercent(totals.FREE)}</div>
            </div>
            <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="text-yellow-800 dark:text-yellow-400 font-semibold">Reserved</div>
              <div className="text-slate-700 dark:text-slate-300">{totals.RESERVED.toLocaleString()} " {formatPercent(totals.RESERVED)}</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="text-slate-800 dark:text-slate-200 font-semibold">Unavailable</div>
              <div className="text-slate-700 dark:text-slate-300">{totals.UNAVAILABLE.toLocaleString()} " {formatPercent(totals.UNAVAILABLE)}</div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-white dark:bg-slate-900/50 flex flex-col gap-2 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300 text-xs">
            <Sparkles className="w-4 h-4 text-slate-800 dark:text-slate-100" />
            Free Blocks (/24, /25, /26)
          </div>
          {freeBlocks.length === 0 && (
            <div className="text-sm text-slate-600 dark:text-slate-400">No free blocks at these sizes.</div>
          )}
          {freeBlocks.slice(0, 8).map((block) => (
            <div key={block.id} className="text-sm font-mono flex justify-between text-slate-900 dark:text-slate-100">
              <span>{block.network}/{block.prefix}</span>
              <span className="text-slate-600 dark:text-slate-400">{block.totalIPs.toLocaleString()} IPs</span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl border bg-white dark:bg-slate-900/50 flex flex-col gap-2 border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300 text-xs">
            <Map className="w-4 h-4 text-slate-800 dark:text-slate-100" />
            Assigned Ranges
          </div>
          <div className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
            {defaultPlanConfig.assignedCidrs.map((cidr) => (
              <div key={cidr} className="font-mono">{cidr}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {rootNode ? renderNode(rootNode) : <div className="text-sm text-slate-600 dark:text-slate-400">No tree data.</div>}
      </div>
    </div>
  );
}

export default SubnetPlanner;
