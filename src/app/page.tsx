"use client";

import * as React from "react";
import { generatePassword } from "@/ai/flows/generate-password";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Copy, RefreshCw, Loader2, RotateCcw } from "lucide-react";
import { Logo } from "@/components/logo";

export default function Home() {
  const [prefix, setPrefix] = React.useState("Mobile");
  const [length, setLength] = React.useState(8);
  const [includeSpecialChars, setIncludeSpecialChars] = React.useState(true);
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const { toast } = useToast();

  const handleGeneratePassword = React.useCallback(async () => {
    setIsLoading(true);
    setPassword("");
    try {
      const result = await generatePassword({
        prefix: prefix,
        length,
        includeSpecialChars,
      });
      setPassword(result.password);
    } catch (error) {
      console.error("Error generating password:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível gerar a senha. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [prefix, length, includeSpecialChars, toast]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast({
      title: "Copiado!",
      description: "Sua nova senha foi copiada para a área de transferência.",
    });
  };

  const handleResetPrefix = () => {
    setPrefix("Mobile");
    toast({
      title: "Prefixo restaurado!",
      description: 'O prefixo foi restaurado para "Mobile".',
    });
  };

  React.useEffect(() => {
    handleGeneratePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <main className="flex flex-col items-center gap-8">
        <Logo />
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Gerador de Senha</CardTitle>
            <CardDescription>
              Personalize o prefixo e as opções para gerar sua senha. O padrão é 'Mobile@'.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prefix">Prefixo da Senha</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="prefix"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="Ex: Mobile"
                  disabled={isLoading}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleResetPrefix}
                  aria-label="Restaurar prefixo padrão"
                  disabled={isLoading}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="length">Comprimento (depois do @)</Label>
                <span className="font-bold text-primary text-lg">{length}</span>
              </div>
              <Slider
                id="length"
                min={4}
                max={20}
                step={1}
                value={[length]}
                onValueChange={(value) => setLength(value[0])}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="special-chars">
                Incluir Caracteres Especiais
              </Label>
              <Switch
                id="special-chars"
                checked={includeSpecialChars}
                onCheckedChange={setIncludeSpecialChars}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGeneratePassword}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                "Gerar Nova Senha"
              )}
            </Button>
          </CardFooter>
        </Card>

        {password && (
          <div className="w-full max-w-md space-y-2 animate-in fade-in-50 duration-500">
            <Label>Sua senha gerada</Label>
            <div className="relative flex items-center">
              <Input
                type="text"
                value={password}
                readOnly
                className="pr-20 text-lg font-mono tracking-wider"
              />
              <div className="absolute right-1 flex gap-1">
                 <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  aria-label="Copiar senha"
                >
                  <Copy className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleGeneratePassword}
                  disabled={isLoading}
                  aria-label="Regenerar senha"
                >
                  <RefreshCw className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
