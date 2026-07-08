import { Activity } from "lucide-react";
import type { Metadata } from "next";
import { DataTable, type DataTableColumn } from "@/components/shared/DataTable";
import { DataTablePagination } from "@/components/shared/DataTablePagination";
import { FilterSelect } from "@/components/shared/FilterSelect";
import { ExportButton } from "@/components/shared/ExportButton";
import { PageHeader } from "@/components/shared/PageHeader";
import { formatDateTime } from "@/lib/format";
import { getActivityLogs } from "@/lib/services/activity";
import type { ActivityLogWithUser } from "@/lib/types/activity";
import {
  ACTION_TYPES,
  ENTITY_TYPES,
  type ActionType,
  type EntityType,
} from "@/lib/types/database";
import { paramNumber, paramString } from "@/lib/url";

export const metadata: Metadata = { title: "Activity Log" };

const PATH = "/dashboard/activity";

export default async function ActivityLogPage(props: PageProps<"/dashboard/activity">) {
  const searchParams = await props.searchParams;
  const actionParam = paramString(searchParams, "action");
  const entityParam = paramString(searchParams, "entity");

  const page = await getActivityLogs({
    page: paramNumber(searchParams, "page"),
    pageSize: 15,
    actionType: ACTION_TYPES.includes(actionParam as ActionType)
      ? (actionParam as ActionType)
      : undefined,
    entityType: ENTITY_TYPES.includes(entityParam as EntityType)
      ? (entityParam as EntityType)
      : undefined,
  });

  const columns: DataTableColumn<ActivityLogWithUser>[] = [
    {
      key: "summary",
      header: "Event",
      cell: (log) => <span className="font-medium">{log.summary}</span>,
    },
    {
      key: "action",
      header: "Action",
      cell: (log) => <span className="text-muted-foreground">{log.actionType}</span>,
    },
    {
      key: "entity",
      header: "Entity",
      cell: (log) => <span className="text-muted-foreground">{log.entityType}</span>,
    },
    {
      key: "time",
      header: "When",
      cell: (log) => <span className="text-muted-foreground">{formatDateTime(log.createdAt)}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity log"
        description="Audit trail of portal actions. Entries older than 30 days are purged automatically in the production design."
        actions={<ExportButton entity="activity" searchParams={searchParams} />}
      />

      <div className="flex flex-wrap items-center gap-3">
        <FilterSelect
          label="Action"
          param="action"
          allLabel="All actions"
          options={ACTION_TYPES.map((a) => ({ value: a, label: a }))}
        />
        <FilterSelect
          label="Entity"
          param="entity"
          allLabel="All entities"
          options={ENTITY_TYPES.map((e) => ({ value: e, label: e }))}
        />
      </div>

      <DataTable
        columns={columns}
        rows={page.items}
        rowKey={(log) => log.logId}
        empty={{
          icon: Activity,
          title: "No activity recorded",
          hint: "Actions performed in the portal appear here as they happen.",
        }}
      />

      <DataTablePagination page={page} pathname={PATH} searchParams={searchParams} itemNoun="events" />
    </div>
  );
}
