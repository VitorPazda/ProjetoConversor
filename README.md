# Projeto Conversor

## Sobre o Projeto

O Projeto Conversor é um sistema desenvolvido para automatizar a conversão de extratos bancários em formato PDF para o padrão `.ofx` (Open Financial Exchange), assim sendo possível importar o extranto no ERP da Assecont.

O objetivo do sistema é tornar o processo de importação de extratos bancários mais organizado e ágil, permitindo a autenticação de usuários, o processamento preciso de arquivos de diferentes bancos (como Sicoob), o salvamento dos arquivos gerados no servidor e a consulta do histórico por usuário.

---

## Funcionalidades

### Autenticação e Login

* Autenticação de usuários por nome de usuário e senha.
* Proteção contra acessos não autorizados.
* Retorno dos dados do usuário autenticado.

### Cadastro de Usuários

* Cadastro completo de usuários no sistema.
* Definição de nível de acesso (Administrador ou Usuário comum).
* Controle de situação ativa ou inativa do usuário.
* Validação de campos obrigatórios e prevenção de cadastros duplicados.

### Gerenciamento de Usuários (Administrador)

* Visualização e listagem dos usuários cadastrados.
* Edição de informações de cadastro.
* Controle de permissões e ativação/desativação de contas.

### Conversão de Extratos

* Upload de arquivos de extratos bancários enviados pelo usuário.
* Seleção da instituição financeira correspondente (ex: Sicoob).
* Leitura e conversão automática dos dados do extrato para o formato `.ofx`.
* Download do arquivo `.ofx` gerado após a conversão.

### Armazenamento de Arquivos

* Salvamento automático do arquivo `.ofx` gerado no servidor.
* Organização física dos arquivos em diretório dedicado no projeto.
* Nomeação única para evitar sobrescrita de arquivos com mesmo nome.

### Histórico de Conversões

* Registro de cada conversão no banco de dados.
* Associação entre usuário, banco, arquivo original e data da conversão.
* Consulta individual do histórico de conversões por usuário.
* Possibilidade de baixar novamente o arquivo `.ofx` gerado no passado.

---

## Tecnologias Utilizadas

### Backend

* ASP.NET Core Web API
* Entity Framework Core
* C#

### Banco de Dados

* PostgreSQL

### Ferramentas e Bibliotecas

* BCrypt.Net (Criptografia e verificação de senhas)
* Beekeeper Studio (Gerenciamento do banco de dados)
* Insomnia (Testes de endpoints da API)

---

## Estrutura do Sistema

O sistema é composto pelos seguintes módulos:

* Autenticação (Login)
* Usuários
* Conversões
* Armazenamento de Arquivos

---

## Objetivo Acadêmico

Este projeto foi desenvolvido como atividade acadêmica com o objetivo de aplicar conceitos de:

* Programação Orientada a Objetos
* Desenvolvimento de Web APIs com ASP.NET Core
* Entity Framework Core
* Arquitetura em Camadas (Controllers, Services e Models)

---

## Autores

Desenvolvido por:

* Filipe Voigt
* Vinicius Correa Miranda
* Vitor Pazda

Instituto Federal de Santa Catarina (IFSC)  
Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas
