import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { clients } from "@/lib/data";

export default function ClientsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-brand-dark mb-1">
          Clients
        </h1>
        <p className="text-sm text-brand-body">
          Manage your dealer and distributor client records.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-brand-section">
                <TableHead className="font-semibold text-brand-dark">
                  Client Name
                </TableHead>
                <TableHead className="font-semibold text-brand-dark">
                  State
                </TableHead>
                <TableHead className="font-semibold text-brand-dark">
                  Contact Person
                </TableHead>
                <TableHead className="font-semibold text-brand-dark">
                  Phone
                </TableHead>
                <TableHead className="font-semibold text-brand-dark">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow
                  key={client.id}
                  className="hover:bg-brand-section/50 transition-colors"
                >
                  <TableCell className="font-medium text-brand-dark">
                    {client.name}
                  </TableCell>
                  <TableCell className="text-brand-body">
                    {client.state}
                  </TableCell>
                  <TableCell className="text-brand-body">
                    {client.contactPerson}
                  </TableCell>
                  <TableCell className="text-brand-body font-mono text-xs">
                    {client.phone}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`rounded-full text-xs font-medium px-2.5 py-0.5 ${
                        client.status === "Active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : client.status === "New"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}
                    >
                      {client.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
