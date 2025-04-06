"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export function NewUserDialog({
  data,
}: {
  data: { name: string; id: string; type: "city" | "network" }[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    entityId: "",
    userRole: "",
  });
  const [selectedEntityType, setSelectedEntityType] = useState<
    "city" | "network"
  >();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      toast.success("User created successfully");
      setOpen(false);
      setFormData({
        name: "",
        email: "",
        password: "",
        entityId: "",
        userRole: "",
      });
    } catch {
      toast.error("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
            <DialogDescription>Add a new user.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="col-span-3"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                className="col-span-3"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="user-role" className="text-right">
                User Role
              </Label>
              <Select
                onValueChange={(value: "city" | "network") => {
                  setSelectedEntityType(value);
                  setFormData({ ...formData, userRole: value });
                }}
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select user role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="city">City Admin</SelectItem>
                  <SelectItem value="network">Network Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedEntityType && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="entity" className="text-right">
                  {selectedEntityType === "city" ? "City" : "Network"}
                </Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({ ...formData, entityId: value })
                  }
                  required
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder={`Select ${selectedEntityType}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {data
                      .filter((item) => item.type === selectedEntityType)
                      .map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
