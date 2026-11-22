import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { API_URL, parseJsonSafe } from "@/lib/api";

const registerSchema = z
  .object({
    name: z.string().min(1, "Nama wajib diisi").min(3, "Nama minimal 3 karakter"),
    email: z
      .string()
      .min(1, "Email wajib diisi")
      .email("Format email tidak valid"),
    password: z
      .string()
      .min(1, "Password wajib diisi")
      .min(6, "Password minimal 6 karakter"),
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const useRegister = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await parseJsonSafe<{ message?: string }>(res);

      if (!res.ok) {
        toast.error(
          result?.message || `Terjadi kesalahan pada server (HTTP ${res.status}). Silakan coba lagi nanti.`
        );
        return;
      }

      toast.success(result?.message || "Registrasi berhasil!");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1000);
    } catch (error) {
      console.error("Register request failed:", error);
      toast.error("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
  };
};
