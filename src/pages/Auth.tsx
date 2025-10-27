import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import logoImage from "@/assets/logo_autonotions.png";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Component is now handled by ProtectedRoute in App.tsx

  const validateEmail = (email: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  // Input sanitization function
  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  };

  // Securely get current user ID from session
  const getCurrentUserId = async (): Promise<string | null> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return session?.user?.id || null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  };

  // Clear errors when user starts typing
  const clearErrors = (field: string) => {
    if (errors[field as keyof typeof errors]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  // Secure logout function
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com segurança.",
      });
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Erro",
        description: "Erro durante o logout.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      email: "",
      password: "",
    };

    // Frontend validations
    if (!formData.email) {
      newErrors.email = "Email é obrigatório";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Por favor, insira um email válido";
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      setIsLoading(true);

      try {
        // Authenticate with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          // Handle specific authentication errors
          if (error.message.includes("Invalid login credentials") || error.message.includes("Email not confirmed")) {
            setErrors({
              ...newErrors,
              email: "Credenciais inválidas. Verifique seu email e senha.",
              password: "Credenciais inválidas. Verifique seu email e senha."
            });
          } else if (error.message.includes("Too many requests")) {
            toast({
              title: "Muitas Tentativas",
              description: "Muitas tentativas de login. Tente novamente em alguns minutos.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Erro de Autenticação",
              description: `Falha no login: ${error.message}`,
              variant: "destructive",
            });
          }
          return;
        }

        if (data.user) {
          // Securely get user ID from session (not storing in local state)
          const { data: sessionData } = await supabase.auth.getSession();

          if (sessionData.session?.user) {
            // Store remember me preference if requested
            if (rememberMe) {
              localStorage.setItem("rememberMe", "true");
            }

            toast({
              title: "Bem-vindo de volta!",
              description: "Login realizado com sucesso.",
            });

            // Secure redirect to protected route
            navigate("/", { replace: true });
          }
        }
      } catch (err) {
        console.error("Authentication error:", err);
        toast({
          title: "Erro",
          description: "Ocorreu um erro inesperado durante o login.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Session check is now handled by ProtectedRoute in App.tsx

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Image Background */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/image.png)' }}
        />
        {/* Optional overlay for better text contrast if needed */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <img src={logoImage} alt="Auto Scale" className="w-10 h-10" />
            <span className="text-2xl font-semibold text-foreground">Auto Scale</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Que bom ver você novamente
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Digite seu email"
                value={formData.email}
                onChange={(e) => {
                  const sanitizedValue = sanitizeInput(e.target.value);
                  setFormData({ ...formData, email: sanitizedValue });
                  clearErrors("email");
                }}
                className="w-full bg-muted border-border focus:border-primary focus:bg-background"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-foreground mb-2 block">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={(e) => {
                    const sanitizedValue = sanitizeInput(e.target.value);
                    setFormData({ ...formData, password: sanitizedValue });
                    clearErrors("password");
                  }}
                  className="w-full bg-muted border-border focus:border-primary focus:bg-background pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  disabled={isLoading}
                />
                <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Lembrar de mim
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-[#0EA5E9] hover:underline hover:text-[#0284C7] transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={isLoading || !formData.email.trim() || !formData.password.trim()}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Fazendo login...
                </div>
              ) : (
                "Entrar"
              )}
            </Button>

            {/* Sign Up Prompt */}
            <p className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link
                to="/signup"
                className="text-[#0EA5E9] hover:underline hover:text-[#0284C7] transition-colors font-medium"
              >
                Cadastre-se agora
              </Link>
            </p>
          </form>

          {/* Security Notice */}
          <div className="mt-8 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              🔒 Sua conexão está segura. Todas as credenciais são criptografadas e processadas de forma segura pelo Supabase.
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            © Auto Scale 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
