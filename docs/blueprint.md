# **App Name**: Mobilemed Password

## Core Features:

- Geração de Senha: Gere uma string de senha aleatória com base no nível de dificuldade selecionado. A ferramenta decide se deve ou não anexar o prefixo 'Mobile@'.
- Configuração de Dificuldade: Permita que os usuários selecionem a dificuldade da senha (por exemplo, comprimento, inclusão de caracteres especiais). O tamanho padrão da senha é 4 e pode ser ajustado para um máximo de 20.
- Copiar para a Área de Transferência: Forneça um botão para copiar a senha gerada para a área de transferência.
- Regenerar Senha: Inclua um botão para gerar uma nova senha.
- Exibir Mensagem de Confirmação: Exiba uma mensagem como 'Sua senha é {senha}' quando uma senha é gerada.
- Geração e Exportação de Senhas em Lote: Gere 10/50 senhas de uma vez e exporte-as.
- Login de Administrador e Gerenciamento de Usuários: Tela de login e cadastro funcional com uma conta de administrador (Felipemartinsduarte@outlook.com.br / Mobile@25) capaz de gerenciar funções e permissões de usuário, incluindo a capacidade de visualizar senhas. A tela de login aparece antes de acessar o aplicativo. Defina quem pode definir senha, quem pode alterar senha, quem pode ver as senhas, e bloquear usuários de alterar a senha. Quero também validações nos inputs e contra qualquer SQL injection. Cheque quando for cadastrar uma senha se já existe algum outro usuario com mesma senha e de erro se houver.  Quero que para cada senha aberta usuario tenha que colocar sua senha para confirmar e ver a senha
- Geração e Gerenciamento de Senhas de Usuário: Gere uma senha para um usuário especificado (identificado por e-mail), exibindo a senha e o e-mail gerados separadamente para cópia. Uma mensagem formatada também é exibida para o primeiro acesso do usuário, e todos os dados (e-mail, senha, logs) são salvos em um banco de dados com recursos de visualização/pesquisa/alteração, registro de ações do usuário, botões de confirmação e rastreamento de quem criou a senha e as configurações.

## Style Guidelines:

- O UI Deve ser limpo pois trata-se de coisa de hospitais, deve ser branco
- #00bcd4
- #f79638
- #00995c
- Fonte: 'Mobilemed' em Poppins Extra Bold e o 'Password' em Light
- Fonte: 'Inter', um sans-serif de estilo grotesco, para uma aparência moderna e neutra, adequada tanto para títulos quanto para corpo de texto.
- Use ícones simples e claros para copiar, regenerar e configurações de dificuldade.
- Mantenha o layout limpo e direto, focando na facilidade de uso.
- Animações de transição sutis para dar uma sensação de segurança, ao mesmo tempo que fornecem um feedback visual agradável ao gerar senhas.