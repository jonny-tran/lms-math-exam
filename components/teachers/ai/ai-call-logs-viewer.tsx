"use client";

import { useEffect, useState } from "react";
import { IconRefresh, IconTrash, IconEye } from "@tabler/icons-react";
import { useAiCallLogs } from "@/hooks/use-ai-call-logs";
import { AiCallLogDto } from "@/types/ai-types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AiCallLogsViewer() {
  const { logs, loading, error, fetchLogs, getLogById, deleteLog } =
    useAiCallLogs();
  const [configIdFilter, setConfigIdFilter] = useState<string>("");
  const [studentIdFilter, setStudentIdFilter] = useState<string>("");
  const [selectedLog, setSelectedLog] = useState<AiCallLogDto | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<number | null>(null);

  useEffect(() => {
    void fetchLogs();
  }, [fetchLogs]);

  const handleFilter = () => {
    const params: { config_id?: number; student_id?: number } = {};
    if (configIdFilter) {
      const id = Number.parseInt(configIdFilter, 10);
      if (!Number.isNaN(id)) {
        params.config_id = id;
      }
    }
    if (studentIdFilter) {
      const id = Number.parseInt(studentIdFilter, 10);
      if (!Number.isNaN(id)) {
        params.student_id = id;
      }
    }
    void fetchLogs(Object.keys(params).length > 0 ? params : undefined);
  };

  const handleViewDetails = async (id: number) => {
    try {
      const log = await getLogById(id);
      setSelectedLog(log);
      setIsDetailDialogOpen(true);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDelete = async () => {
    if (logToDelete) {
      try {
        await deleteLog(logToDelete);
        setIsDeleteDialogOpen(false);
        setLogToDelete(null);
      } catch (error) {
        // Error is handled by the hook
      }
    }
  };

  const handleOpenDeleteDialog = (id: number) => {
    setLogToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Call Logs</h2>
          <p className="text-muted-foreground text-sm">
            View and manage AI interaction logs
          </p>
        </div>
        <Button onClick={() => void fetchLogs()} variant="outline">
          <IconRefresh className="mr-2 size-4" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter logs by configuration or student</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="config-id">Config ID</Label>
              <Input
                id="config-id"
                type="number"
                placeholder="Filter by config ID"
                value={configIdFilter}
                onChange={(e) => setConfigIdFilter(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="student-id">Student ID</Label>
              <Input
                id="student-id"
                type="number"
                placeholder="Filter by student ID"
                value={studentIdFilter}
                onChange={(e) => setStudentIdFilter(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleFilter} className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Logs ({logs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && logs.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          ) : logs.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No logs found. AI call logs will appear here when AI services are
              used.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Log ID</TableHead>
                    <TableHead>Config ID</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Request Preview</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.log_id}>
                      <TableCell className="font-medium">
                        {log.log_id}
                      </TableCell>
                      <TableCell>{log.config_id}</TableCell>
                      <TableCell>{log.student_id ?? "-"}</TableCell>
                      <TableCell>
                        {log.service_name ? (
                          <Badge variant="secondary">{log.service_name}</Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {log.request_text
                          ? log.request_text.substring(0, 50) + "..."
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {format(new Date(log.created_at), "MMM dd, yyyy HH:mm")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(log.log_id)}
                          >
                            <IconEye className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(log.log_id)}
                          >
                            <IconTrash className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Log Details</DialogTitle>
            <DialogDescription>
              Detailed information about this AI call log
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-muted-foreground">Log ID</Label>
                    <p className="font-medium">{selectedLog.log_id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Config ID</Label>
                    <p className="font-medium">{selectedLog.config_id}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Student ID</Label>
                    <p className="font-medium">
                      {selectedLog.student_id ?? "-"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Matrix ID</Label>
                    <p className="font-medium">
                      {selectedLog.matrix_id ?? "-"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Service</Label>
                    <p className="font-medium">
                      {selectedLog.service_name ?? "-"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Created At</Label>
                    <p className="font-medium">
                      {format(
                        new Date(selectedLog.created_at),
                        "MMM dd, yyyy HH:mm:ss"
                      )}
                    </p>
                  </div>
                </div>
                {selectedLog.request_text && (
                  <div>
                    <Label className="text-muted-foreground">Request</Label>
                    <div className="mt-2 rounded-lg border bg-muted p-4">
                      <pre className="whitespace-pre-wrap text-sm">
                        {selectedLog.request_text}
                      </pre>
                    </div>
                  </div>
                )}
                {selectedLog.response_text && (
                  <div>
                    <Label className="text-muted-foreground">Response</Label>
                    <div className="mt-2 rounded-lg border bg-muted p-4">
                      <pre className="whitespace-pre-wrap text-sm">
                        {selectedLog.response_text}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Log</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this log entry? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

