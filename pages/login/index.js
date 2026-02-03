import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const loginFormSchema = z.object({
  email: z.email({
    message: "Email inválido",
  }),
  password: z.string().trim(),
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginFormSchema),
  });

  const router = useRouter();

  async function handleLogin(data) {
    try {
      console.log("handleSubmit");
      const response = await fetch("/api/v1/sessions", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (response.status === 201) {
        router.push("/admin");
      } else {
        const body = await response.json();
        toast.error(body.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
      <form className="flex w-full" onSubmit={handleSubmit(handleLogin)}>
        <Card className="w-95/100 max-w-128 py-4 px-2 lg:p-6 mx-auto rounded-lg shadow-md ">
          <CardHeader className="flex items-center justify-center">
            <CardTitle className="text-xl">Acesse sua conta</CardTitle>
          </CardHeader>
          <CardContent className="flex-col space-y-2">
            <div className="flex justify-between">
              <Label>E-mail</Label>
              {errors.email && (
                <span className="text-red-500 text-sm space-y-0">
                  {errors.email.message}
                </span>
              )}
            </div>
            <Input
              id="email"
              placeholder="Digite seu email"
              {...register("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
            />
            <Label>Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              {...register("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </CardContent>
          <CardFooter>
            <Button
              className="w-full rouded-xl cursor-pointer"
              type="submit"
              disabled={!email || !password || isSubmitting}
            >
              Entrar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default Login;
