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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Copy, Loader2, RefreshCw, RotateCcw, Users, Trash2, Download, Save } from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type SavedUser = {
  email: string;
  password: string;
};

export default function Home() {
  const [prefix, setPrefix] = React.useState("Mobile");
  const [length, setLength] = React.useState(8);
  const [quantity, setQuantity] = React.useState(1);
  const [includeSpecialChars, setIncludeSpecialChars] = React.useState(true);
  const [onlyUppercase, setOnlyUppercase] = React.useState(false);
  const [passwords, setPasswords] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [copiedPasswords, setCopiedPasswords] = React.useState<Set<string>>(new Set());

  // Deployment Mode State
  const [isDeploymentMode, setIsDeploymentMode] = React.useState(false);
  const [emails, setEmails] = React.useState<string[]>(Array(50).fill(""));
  const [savedUsers, setSavedUsers] = React.useState<SavedUser[]>([]);
  const [savedEntries, setSavedEntries] = React.useState<Set<number>>(new Set());


  const { toast } = useToast();

  const handleGenerateAllPasswords = React.useCallback(async () => {
    setIsLoading(true);
    setPasswords([]);
    setCopiedPasswords(new Set());
    setSavedEntries(new Set());
    if (isDeploymentMode) {
      setEmails(Array(quantity).fill(""));
    }
    try {
      const generatedPasswords: string[] = [];
      for (let i = 0; i < quantity; i++) {
        const result = await generatePassword({
          prefix: prefix,
          length,
          includeSpecialChars,
          onlyUppercase,
        });
        generatedPasswords.push(result.password);
      }
      setPasswords(generatedPasswords);
    } catch (error) {
      console.error("Error generating passwords:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível gerar as senhas. Tente novamente.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [prefix, length, quantity, includeSpecialChars, onlyUppercase, toast, isDeploymentMode]);

  const handleRegeneratePassword = async (index: number) => {
    try {
      const result = await generatePassword({
        prefix: prefix,
        length,
        includeSpecialChars,
        onlyUppercase,
      });
      const newPasswords = [...passwords];
      const oldPassword = newPasswords[index];
      newPasswords[index] = result.password;
      setPasswords(newPasswords);
      
      if (isDeploymentMode) {
        if(savedEntries.has(index)) {
            const userEmail = emails[index];
            setSavedUsers(prev => prev.filter(u => u.email !== userEmail));
            setSavedEntries(prev => {
                const newSaved = new Set(prev);
                newSaved.delete(index);
                return newSaved;
            });
            toast({
                title: "Usuário Removido!",
                description: `O usuário ${userEmail} foi removido da lista de salvos. Por favor, salve a nova senha.`,
                duration: 3000,
            });
        }
      } else {
         setCopiedPasswords(prev => {
            const newCopied = new Set(prev);
            newCopied.delete(oldPassword);
            return newCopied;
         });
      }

    } catch (error) {
      console.error("Error regenerating password:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível regerar a senha. Tente novamente.",
        duration: 3000,
      });
    }
  };

  const handleCopy = (password: string) => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast({
      title: "Copiado!",
      description: "A senha foi copiada para a área de transferência.",
      duration: 2000,
    });
    if (quantity > 1 && !isDeploymentMode) {
      setCopiedPasswords(prev => new Set(prev).add(password));
    }
  };

  const handlePasswordClick = (password: string) => {
     if (isDeploymentMode) return;
    if (copiedPasswords.has(password)) {
      setCopiedPasswords(prev => {
        const newCopied = new Set(prev);
        newCopied.delete(password);
        return newCopied;
      });
    }
  }

  const handleResetPrefix = () => {
    setPrefix("Mobile");
    toast({
      title: "Prefixo restaurado!",
      description: 'O prefixo foi restaurado para "Mobile".',
      duration: 2000,
    });
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
     if (savedEntries.has(index)) {
      setSavedEntries(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  const handleSaveUser = (index: number) => {
    const email = emails[index];
    const password = passwords[index];

    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "E-mail e senha são obrigatórios.",
        duration: 3000,
      });
      return;
    }
    
    if (savedUsers.length >= 100) {
      toast({
        variant: "destructive",
        title: "Limite Atingido",
        description: "O limite de 100 usuários salvos foi atingido. Por favor, resete a lista.",
        duration: 3000,
      });
      return;
    }

    setSavedUsers(prev => [...prev, { email, password }]);
    setSavedEntries(prev => new Set(prev).add(index));
    toast({
      title: "Usuário Salvo!",
      description: `${email} foi salvo com sucesso.`,
      duration: 2000,
    });
  };
  
  const handleResetSavedUsers = () => {
    setSavedUsers([]);
    setSavedEntries(new Set());
    toast({
      title: "Resetado!",
      description: "A lista de usuários salvos foi limpa.",
      duration: 2000,
    });
  };

  const handleRemoveSavedUser = (indexToRemove: number) => {
    const userToRemove = savedUsers[indexToRemove];
    setSavedUsers(prev => prev.filter((_, i) => i !== indexToRemove));

    // Un-highlight the entry in the main list if it exists
    const entryIndex = emails.findIndex(email => email === userToRemove.email);
    if (entryIndex !== -1 && passwords[entryIndex] === userToRemove.password) {
        setSavedEntries(prev => {
            const newSaved = new Set(prev);
            newSaved.delete(entryIndex);
            return newSaved;
        });
    }

     toast({
      title: "Removido!",
      description: "O usuário foi removido da lista.",
      duration: 2000,
    });
  };

  const exportCredentials = () => {
    const content = savedUsers.map(u => `Email: ${u.email} Senha:${u.password}`).join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'credenciais.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportWelcomeMessages = () => {
    const content = savedUsers.map(u => 
      `Seja Bem Vindo ao nosso sistema de Telerradiologia MobileMed segue a baixo as informações necessárias para o seu primeiro acesso Portal: laudos.mobilemed.com.br/login\nLogin: e-mail: ${u.email}\nSenha Temporária: ${u.password}`
    ).join('\n\n---\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mensagens_boas_vindas.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Função para copiar credenciais para a área de transferência
  const copyCredentialsToClipboard = () => {
    const content = savedUsers.map(u => `Email: ${u.email} Senha:${u.password}`).join('\n');
    navigator.clipboard.writeText(content);
    toast({
      title: "Copiado!",
      description: "Credenciais copiadas para a área de transferência.",
      duration: 2000,
    });
  };

  // Função para copiar mensagens de boas-vindas para a área de transferência
  const copyWelcomeMessagesToClipboard = () => {
    const content = savedUsers.map(u => 
      `Seja Bem Vindo ao nosso sistema de Telerradiologia MobileMed segue a baixo as informações necessárias para o seu primeiro acesso Portal: laudos.mobilemed.com.br/login\nLogin: e-mail: ${u.email}\nSenha Temporária: ${u.password}`
    ).join('\n\n---\n\n');
    navigator.clipboard.writeText(content);
    toast({
      title: "Copiado!",
      description: "Mensagens de boas-vindas copiadas para a área de transferência.",
      duration: 2000,
    });
  };


  React.useEffect(() => {
    handleGenerateAllPasswords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <main className="flex w-full max-w-md flex-col items-center gap-8">
        <Logo />

        <div className="flex items-center justify-between w-full">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Usuários Salvos ({savedUsers.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>Usuários Salvos</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-72 w-full rounded-md border">
                  <div className="p-4 space-y-2">
                    {savedUsers.length > 0 ? (
                      savedUsers.map((user, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                           <div>
                            <p className="text-sm font-medium">{user.email}</p>
                            <p className="text-xs text-muted-foreground font-mono">{user.password}</p>
                           </div>
                           <Button variant="ghost" size="icon" onClick={() => handleRemoveSavedUser(index)}>
                              <Trash2 className="h-4 w-4 text-red-500"/>
                           </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-center text-muted-foreground">Nenhum usuário salvo.</p>
                    )}
                  </div>
                </ScrollArea>
                <DialogFooter>
                    <div className="w-full flex justify-between flex-col sm:flex-row gap-2">
                        <Button variant="destructive" onClick={handleResetSavedUsers}>
                            <Trash2 className="mr-2 h-4 w-4" /> Resetar
                        </Button>
                        <div className="flex flex-wrap gap-2 justify-end">
                            <Button variant="secondary" onClick={exportCredentials} disabled={savedUsers.length === 0}>
                                <Download className="mr-2 h-4 w-4" /> Exportar Credenciais
                            </Button>
                            <Button variant="outline" onClick={copyCredentialsToClipboard} disabled={savedUsers.length === 0}>
                                <Copy className="mr-2 h-4 w-4" /> Copiar Credenciais
                            </Button>
                            <Button onClick={exportWelcomeMessages} disabled={savedUsers.length === 0}>
                                <Download className="mr-2 h-4 w-4" /> Exportar Mensagens
                            </Button>
                            <Button variant="outline" onClick={copyWelcomeMessagesToClipboard} disabled={savedUsers.length === 0}>
                                <Copy className="mr-2 h-4 w-4" /> Copiar Mensagens
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
        </div>


        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Gerador de Senha</CardTitle>
            <CardDescription>
              Personalize as opções para gerar suas senhas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <Label>Modo Implantação</Label>
                  <CardDescription>
                    Gere e-mail e senha para novos usuários.
                  </CardDescription>
                </div>
                <Switch
                    checked={isDeploymentMode}
                    onCheckedChange={(checked) => {
                        setIsDeploymentMode(checked);
                        setPasswords([]); // Clear passwords when switching mode
                        setSavedEntries(new Set());
                    }}
                    disabled={isLoading}
                />
            </div>
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
                <Label htmlFor="quantity">Quantidade de Senhas</Label>
                <span className="font-bold text-primary text-lg">{quantity}</span>
              </div>
              <Slider
                id="quantity"
                min={1}
                max={50}
                step={1}
                value={[quantity]}
                onValueChange={(value) => setQuantity(value[0])}
                disabled={isLoading}
              />
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
                disabled={isLoading || onlyUppercase}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="only-uppercase">
                Apenas Letras Maiúsculas
              </Label>
              <Switch
                id="only-uppercase"
                checked={onlyUppercase}
                onCheckedChange={setOnlyUppercase}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGenerateAllPasswords}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                "Gerar Novas Senhas"
              )}
            </Button>
          </CardFooter>
        </Card>

        {passwords.length > 0 && (
          <div className="w-full max-w-md space-y-4 animate-in fade-in-50 duration-500">
             <Label>Suas senhas geradas</Label>
             <div className="space-y-2">
              {passwords.map((password, index) => (
                <div key={index} className="space-y-2 pb-4">
                   {isDeploymentMode && (
                     <div className="space-y-2">
                        <Label htmlFor={`email-${index}`}>E-mail do Usuário {index + 1}</Label>
                        <Input
                            id={`email-${index}`}
                            type="email"
                            placeholder="usuario@email.com"
                            value={emails[index]}
                            onChange={(e) => handleEmailChange(index, e.target.value)}
                            className={cn(
                                savedEntries.has(index) && "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700"
                            )}
                         />
                     </div>
                   )}
                  <div className="relative flex items-center">
                    <Input
                      type="text"
                      value={password}
                      readOnly
                      onClick={() => handlePasswordClick(password)}
                      className={cn(
                        "pr-24 text-lg font-mono tracking-wider transition-colors cursor-pointer",
                        isDeploymentMode ? "pr-24" : "pr-24",
                        (copiedPasswords.has(password) && !isDeploymentMode) && "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700",
                        (savedEntries.has(index) && isDeploymentMode) && "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700"
                      )}
                    />
                    <div className="absolute right-1 flex gap-1">
                      {isDeploymentMode ? (
                        <>
                           <Button variant="ghost" size="icon" onClick={() => handleRegeneratePassword(index)} aria-label="Regerar senha">
                            <RefreshCw className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleSaveUser(index)} aria-label="Salvar usuário" disabled={savedEntries.has(index)}>
                           <Save className="h-5 w-5 text-primary"/>
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button variant="ghost" size="icon" onClick={() => handleRegeneratePassword(index)} aria-label="Regerar senha">
                            <RefreshCw className="h-5 w-5" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleCopy(password)} aria-label="Copiar senha">
                            <Copy className="h-5 w-5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
