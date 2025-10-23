import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";
import logoImage from "@/assets/logo_autonotions.png";

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumbers: false,
    hasNonalphas: false,
  });

  const validateEmail = (email: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonalphas = /\W/.test(password);
    return minLength && hasUpperCase && hasLowerCase && hasNumbers && hasNonalphas;
  };

  const getPasswordValidationDetails = (password: string) => {
    return {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasNonalphas: /\W/.test(password),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Defina um nome de usuário";
    }

    if (!formData.email) {
      newErrors.email = "É necessário inserir um email";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Por favor, insira um email válido";
    }

    if (!formData.password) {
      newErrors.password = "A senha é necessária";
    } else if (!validatePassword(formData.password)) {
      const missingRequirements = [];
      const validation = getPasswordValidationDetails(formData.password);

      if (!validation.minLength) missingRequirements.push("8+ caracteres");
      if (!validation.hasUpperCase) missingRequirements.push("letra maiúscula");
      if (!validation.hasLowerCase) missingRequirements.push("letra minúscula");
      if (!validation.hasNumbers) missingRequirements.push("número");
      if (!validation.hasNonalphas) missingRequirements.push("caractere especial");

      newErrors.password = `Senha deve conter: ${missingRequirements.join(", ")}`;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Por favor, confirme sua senha";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas estão diferentes";
    }

    setErrors(newErrors);

    if (!newErrors.name && !newErrors.email && !newErrors.password && !newErrors.confirmPassword) {
      setIsLoading(true);

      try {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
            },
          },
        });

        if (error) {
          // Handle specific error cases
          if (error.message.includes("already registered") || error.message.includes("User already registered")) {
            setErrors({ ...newErrors, email: "Este email já está registrado. Tente fazer login ou use outro email." });
          } else if (error.message.includes("Password should be")) {
            setErrors({ ...newErrors, password: "A senha não atende aos requisitos mínimos de segurança." });
          } else if (error.message.includes("Invalid email")) {
            setErrors({ ...newErrors, email: "Formato de email inválido." });
          } else if (error.message.includes("weak password") || error.message.includes("Password is too weak")) {
            setErrors({ ...newErrors, password: "A senha é muito fraca. Use uma combinação de letras, números e símbolos." });
          } else {
            toast({
              title: "Erro no Cadastro",
              description: `Falha ao criar conta: ${error.message}`,
              variant: "destructive",
            });
          }
        } else if (data.user) {
          // Insert into custom users table
          const { error: insertError } = await supabase.from('users').insert({
            id: data.user.id,
            email: formData.email,
            name: formData.name,
          } as any); // Type assertion to bypass strict typing

          if (insertError) {
            console.error("Erro ao inserir usuário na tabela:", insertError);
            toast({
              title: "Aviso",
              description: "Usuário autenticado criado, mas falha ao salvar dados adicionais. Entre em contato com o suporte.",
              variant: "default",
            });
            // Still proceed as auth user is created
          }

          toast({
            title: "Cadastro Realizado com Sucesso",
            description: "Conta criada! Verifique seu email para confirmar e ativar sua conta.",
          });
          navigate("/login");
        }
      } catch (err) {
        toast({
          title: "Erro",
          description: "Ocorreu um erro inesperado.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

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

      {/* Right Column - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <img src={logoImage} alt="Auto Scale" className="w-10 h-10" />
            <span className="text-2xl font-semibold text-foreground">Auto Scale</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-foreground mb-8">
            Create your account
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <Label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
                className="w-full bg-muted border-border focus:border-primary focus:bg-background"
              />
              {errors.name && (
                <p className="text-destructive text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: "" });
                }}
                className="w-full bg-muted border-border focus:border-primary focus:bg-background"
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-foreground mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => {
                    const newPassword = e.target.value;
                    setFormData({ ...formData, password: newPassword });
                    setPasswordValidation(getPasswordValidationDetails(newPassword));
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  className="w-full bg-muted border-border focus:border-primary focus:bg-background pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs mt-1">{errors.password}</p>
              )}

              {/* Password Requirements Indicator */}
              {formData.password && (
                <div className="mt-2 p-2 bg-muted/50 rounded-md">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Requisitos da senha:</p>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className={`flex items-center gap-1 ${passwordValidation.minLength ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <span className={`w-1 h-1 rounded-full ${passwordValidation.minLength ? 'bg-green-600' : 'bg-muted-foreground'}`} />
                      8+ caracteres
                    </div>
                    <div className={`flex items-center gap-1 ${passwordValidation.hasUpperCase ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <span className={`w-1 h-1 rounded-full ${passwordValidation.hasUpperCase ? 'bg-green-600' : 'bg-muted-foreground'}`} />
                      Letra maiúscula
                    </div>
                    <div className={`flex items-center gap-1 ${passwordValidation.hasLowerCase ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <span className={`w-1 h-1 rounded-full ${passwordValidation.hasLowerCase ? 'bg-green-600' : 'bg-muted-foreground'}`} />
                      Letra minúscula
                    </div>
                    <div className={`flex items-center gap-1 ${passwordValidation.hasNumbers ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <span className={`w-1 h-1 rounded-full ${passwordValidation.hasNumbers ? 'bg-green-600' : 'bg-muted-foreground'}`} />
                      Número
                    </div>
                    <div className={`flex items-center gap-1 ${passwordValidation.hasNonalphas ? 'text-green-600' : 'text-muted-foreground'}`}>
                      <span className={`w-1 h-1 rounded-full ${passwordValidation.hasNonalphas ? 'bg-green-600' : 'bg-muted-foreground'}`} />
                      Caractere especial
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground mb-2 block">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: "" });
                  }}
                  className="w-full bg-muted border-border focus:border-primary focus:bg-background pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-destructive text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-primary/40 active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Criando conta...
                </div>
              ) : (
                "Criar conta"
              )}
            </Button>

            {/* Sign In Prompt */}
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#0EA5E9] hover:underline hover:text-[#0284C7] transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground mt-12">
            © Auto Scale 2025
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;