import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { orders } from "@/lib/data";

export default function OrdersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-brand-dark mb-1">
          Orders
        </h1>
        <p className="text-sm text-brand-body">
          Track and manage all dealer and distributor orders.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-brand-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-brand-section">
                <TableHead className="font-semibold text-brand-dark">
                  Order ID
                </TableHead>
                <TableHead className="font-semibold text-brand-dark">
                  Client
                </TableHead>
                <TableHead className="font-semibold text-brand-dark">
                  Amount (INR)
                </TableHead>
                <TableHead className="font-semibold text-brand-dark">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-brand-dark">
                  Date
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow
                  key={order.id}
                  className="hover:bg-brand-section/50 transition-colors"
                >
                  <TableCell className="font-medium font-mono text-xs text-brand-dark">
                    {order.id}
                  </TableCell>
                  <TableCell className="text-brand-body">
                    {order.client}
                  </TableCell>
                  <TableCell className="text-brand-dark font-medium">
                    Rs. {order.amount}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`rounded-full text-xs font-medium px-2.5 py-0.5 ${
                        order.status === "Completed"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : order.status === "Approved"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-brand-body text-sm">
                    {new Date(order.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
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
