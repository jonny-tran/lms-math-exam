"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { MeResponse } from "@/types/auth";

const STUDENT_ROLE = "student";

const normalizeRole = (role?: string | null) =>
  role?.toString().toLowerCase().trim() ?? "";

export default function StudentsPage() {
  const router = useRouter();
  const { getCurrentUser, logout, loading, error, clearError } = useAuth();
  const [profile, setProfile] = useState<MeResponse | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const fetchProfile = async () => {
    setStatus("loading");
    try {
      const data = await getCurrentUser();
      setProfile(data);
      setStatus("idle");
    } catch {
      setProfile(null);
      setStatus("error");
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isStudent = useMemo(
    () => normalizeRole(profile?.role) === STUDENT_ROLE,
    [profile?.role]
  );

  const handleLogout = async () => {
    clearError();
    logout();
    setProfile(null);
    router.push("/signin");
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-10">
      <header>
        <h1 className="text-3xl font-semibold">Student Portal</h1>
        <p className="text-muted-foreground">
          Trang bảo vệ cho role <code>Student</code>. Kiểm tra token và dữ liệu
          từ
          <code> /api/Auth/me</code>.
        </p>
      </header>

      <section className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={fetchProfile}
          className="rounded bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
          disabled={loading || status === "loading"}
        >
          {loading || status === "loading"
            ? "Đang tải..."
            : "Tải lại thông tin"}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded border border-border px-4 py-2"
        >
          Đăng xuất
        </button>
      </section>

      {error && (
        <div className="rounded border border-destructive/40 bg-destructive/10 p-4 text-destructive">
          <p>Lỗi: {JSON.stringify(error)}</p>
        </div>
      )}

      <section className="rounded border p-6">
        <h2 className="mb-3 text-xl font-medium">Thông tin tài khoản</h2>
        {profile ? (
          <pre className="whitespace-pre-wrap break-all text-sm">
            {JSON.stringify(profile, null, 2)}
          </pre>
        ) : (
          <p className="text-muted-foreground">
            Chưa có dữ liệu. Hãy đăng nhập và chọn &ldquo;Tải lại thông
            tin&rdquo;.
          </p>
        )}
      </section>

      {profile && !isStudent && (
        <div className="rounded border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <p>
            Tài khoản hiện tại không có quyền Student (role:{" "}
            <strong>{profile.role}</strong>). Vui lòng đăng nhập bằng tài khoản
            phù hợp.
          </p>
        </div>
      )}
    </main>
  );
}
