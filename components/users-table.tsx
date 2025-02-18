"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@prisma/client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/auth-client";
import BanButton from "./ban-button";
import UnbanButton from "./unban-button";
import ToAdminButton from "./to-admin-button";
import ToUserButton from "./to-user-button";
import DeleteButton from "./delete-button";

export default function UsersTable({ userId }: { userId: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const router = useRouter();

  // 🔄 Функция для загрузки пользователей
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await authClient.admin.listUsers({ query: { limit: 10000 } });
      if (response?.data) {
        setUsers(response.data.users as User[]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch users"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🟢 Загружаем пользователей при первом рендере
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // 🟢 Обновляем локальный список при изменении статуса пользователя
  const updateUserStatus = (userId: string, banned: boolean) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, banned } : user))
    );
  };

  // 🟢 Обновляем локальный список при изменении роли пользователя
  const updateUserRole = (userId: string, role: string) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, role } : user))
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <span>Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center p-4">
        <span className="text-red-500">Error: {error.message}</span>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Joined</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>
              {user.banned ? (
                <span className="text-red-500">Banned</span>
              ) : (
                <span className="text-green-500">Active</span>
              )}
            </TableCell>
            <TableCell>
              {new Date(user.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="flex gap-2">
              {user.id === userId ? (
                <>
                  <ToAdminButton userId={user.id} onRoleChange={updateUserRole} />
                  <ToUserButton userId={user.id} onRoleChange={updateUserRole} />
                </>
              ) : (
                <>
                  <BanButton userId={user.id} onStatusChange={updateUserStatus} />
                  <UnbanButton userId={user.id} onStatusChange={updateUserStatus} />
                  <ToAdminButton userId={user.id} onRoleChange={updateUserRole} />
                  <ToUserButton userId={user.id} onRoleChange={updateUserRole} />
                  <DeleteButton userId={user.id} onDelete={fetchUsers} />
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}