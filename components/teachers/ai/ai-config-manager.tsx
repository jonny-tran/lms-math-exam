"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus, IconTrash, IconEdit, IconCheck } from "@tabler/icons-react";
import { useAiConfigs } from "@/hooks/use-ai-configs";
import {
  AiConfigDto,
  CreateAiConfigRequest,
  UpdateAiConfigRequest,
} from "@/types/ai-types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
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

const configFormSchema = z.object({
  config_name: z.string().min(1, "Config name is required"),
  model_name: z.string().optional().or(z.literal("")),
  temperature: z.number().min(0).max(2).optional(),
  max_tokens: z.number().int().positive().optional(),
  settings_json: z.string().optional().or(z.literal("")),
  is_active: z.boolean(),
});

type ConfigFormValues = z.infer<typeof configFormSchema>;

interface AiConfigManagerProps {
  teacherId: number;
}

export function AiConfigManager({ teacherId }: AiConfigManagerProps) {
  const {
    configs,
    loading,
    error,
    fetchConfigs,
    createConfig,
    updateConfig,
    deleteConfig,
  } = useAiConfigs(teacherId);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<AiConfigDto | null>(null);

  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configFormSchema),
    defaultValues: {
      config_name: "",
      model_name: "",
      temperature: 0.7,
      max_tokens: 2048,
      settings_json: "",
      is_active: true,
    },
  });

  useEffect(() => {
    void fetchConfigs();
  }, [fetchConfigs]);

  const handleOpenCreate = () => {
    setEditingConfig(null);
    form.reset({
      config_name: "",
      model_name: "",
      temperature: 0.7,
      max_tokens: 2048,
      settings_json: "",
      is_active: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (config: AiConfigDto) => {
    setEditingConfig(config);
    form.reset({
      config_name: config.config_name,
      model_name: config.model_name ?? "",
      temperature: config.temperature ?? 0.7,
      max_tokens: config.max_tokens ?? 2048,
      settings_json: config.settings_json ?? "",
      is_active: config.is_active,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (values: ConfigFormValues) => {
    try {
      if (editingConfig) {
        const payload: UpdateAiConfigRequest = {
          config_name: values.config_name,
          model_name: values.model_name || undefined,
          temperature: values.temperature,
          max_tokens: values.max_tokens,
          settings_json: values.settings_json || undefined,
          is_active: values.is_active,
        };
        await updateConfig(editingConfig.config_id, payload);
      } else {
        const payload: CreateAiConfigRequest = {
          teacher_id: teacherId,
          config_name: values.config_name,
          model_name: values.model_name || undefined,
          temperature: values.temperature,
          max_tokens: values.max_tokens,
          settings_json: values.settings_json || undefined,
          is_active: values.is_active,
        };
        await createConfig(payload);
      }
      setIsDialogOpen(false);
      form.reset();
    } catch {
      // Error is handled by the hook
    }
  };

  const handleDelete = async () => {
    if (editingConfig) {
      try {
        await deleteConfig(editingConfig.config_id);
        setIsDeleteDialogOpen(false);
        setEditingConfig(null);
      } catch {
        // Error is handled by the hook
      }
    }
  };

  if (loading && configs.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Configurations</h2>
          <p className="text-muted-foreground text-sm">
            Manage your AI model configurations
          </p>
        </div>
        <Button onClick={handleOpenCreate}>
          <IconPlus className="mr-2 size-4" />
          Create Config
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {configs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4 text-center">
              No AI configurations found. Create your first configuration to get
              started.
            </p>
            <Button onClick={handleOpenCreate}>
              <IconPlus className="mr-2 size-4" />
              Create Config
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {configs.map((config) => (
            <Card key={config.config_id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {config.config_name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {config.model_name || "No model specified"}
                    </CardDescription>
                  </div>
                  <Badge variant={config.is_active ? "default" : "secondary"}>
                    {config.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {config.temperature !== null &&
                  config.temperature !== undefined && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        Temperature:{" "}
                      </span>
                      <span className="font-medium">{config.temperature}</span>
                    </div>
                  )}
                {config.max_tokens && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Max Tokens: </span>
                    <span className="font-medium">{config.max_tokens}</span>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(config)}
                  >
                    <IconEdit className="mr-1 size-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingConfig(config);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <IconTrash className="mr-1 size-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingConfig
                ? "Edit AI Configuration"
                : "Create AI Configuration"}
            </DialogTitle>
            <DialogDescription>
              {editingConfig
                ? "Update your AI configuration settings"
                : "Create a new AI configuration profile"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="config_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Config Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Calculus Tutor Bot"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., gpt-4, gpt-3.5-turbo"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temperature</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="2"
                          placeholder="0.7"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number.parseFloat(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="max_tokens"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Tokens</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="2048"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number.parseInt(e.target.value, 10)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="settings_json"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Settings (JSON)</FormLabel>
                    <FormControl>
                      <Input placeholder='{"key": "value"}' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <div className="text-muted-foreground text-sm">
                        Enable this configuration
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner className="mr-2 size-4" />
                      {editingConfig ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      {editingConfig ? (
                        <>
                          <IconCheck className="mr-2 size-4" />
                          Update
                        </>
                      ) : (
                        <>
                          <IconPlus className="mr-2 size-4" />
                          Create
                        </>
                      )}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Configuration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{editingConfig?.config_name}
              &quot;? This action cannot be undone.
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
