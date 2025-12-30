BlogApp é um aplicativo de blog dinâmico construído com React Native + Expo, integrando Firebase (Auth, Firestore, Storage) para autenticação, persistência e gerenciamento de posts/usuários. Ele segue uma arquitetura modular com separação clara entre rotas, telas, serviços e componentes.

# Arquitetura do Projeto
O BlogApp segue uma arquitetura modular em camadas, organizada em pastas:
1. Camada de UI (Interface de Usuário)
- Local: app/screens/
- Responsabilidade: Telas que o usuário interage.
- Exemplos:
- Home/index.tsx: lista posts ou usuários dependendo da role.
- Login/index.tsx: autenticação de usuários.
- Register/index.tsx: criação de novas contas.
- Professors/index.tsx: lista professores.
- Alunos/index.tsx: lista alunos.
- post/[postId].tsx: detalhe de um post.
- post/newpost.tsx: criação de novo post.
- post/[editpost].tsx: edição de post.
Cada tela usa React Hooks (useState, useEffect, useCallback) para gerenciar estado e FlatList para renderizar listas dinâmicas.

2. Camada de Navegação
- Local: routes/app.routes.tsx
- Responsabilidade: Controlar fluxo de telas e abas.
- Biblioteca: @react-navigation/native, @react-navigation/bottom-tabs, @react-navigation/native-stack.
Fluxos principais:
- AuthStack: telas de login e registro.
- MainTabs: abas principais (Feed, Professores, Alunos).
- PostStack: navegação interna do Feed (detalhe, novo post, edição).
- ProfessorsStack / AlunosStack: navegação interna das abas de usuários.
Controle de acesso:
- Tabs condicionais: ex. role === "professor" → mostra aba Professores.
- Isso garante que cada tipo de usuário veja apenas o que tem permissão.

3. Camada de Serviços
- Local: service/
- Responsabilidade: Comunicação com Firebase (Firestore + Storage).
- Exemplos:
- postService.ts: CRUD de posts (createPost, getPostById, updatePost, deletePost, getAllPosts).
- userService.ts: CRUD de usuários (createUser, getUserById, updateUser, deleteUser, getAllUsers, getUsersByRole).
Como funciona:
- Cada função usa métodos do Firebase (addDoc, getDoc, updateDoc, deleteDoc, getDocs).
- Upload de imagens é feito com uploadBytes e getDownloadURL no Storage.
- Os dados são tipados com interfaces (Post, User) para consistência.

4. Camada de Dados
- Local: firebaseConfig.ts
- Responsabilidade: Inicializar Firebase e exportar instâncias de:
- auth → autenticação.
- db → Firestore.
- storage → Storage.
Exemplo:
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = { /* credenciais */ };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);



# Como o código funciona
Autenticação
- Usuários se registram com email/senha via createUserWithEmailAndPassword.
- Professores podem criar contas de alunos sem logar neles (usando app secundário ou apenas Firestore).
- Roles (aluno, professor, admin) são gravadas no documento do usuário no Firestore.
Posts
- Criados via createPost:
- Se houver imagem, é enviada ao Storage.
- URL da imagem é salva junto ao documento no Firestore.
- Listados em Home/index.tsx com ordenação por createdAt.
- Editados e deletados com updatePost e deletePost.
Usuários
- Professores e alunos são listados com getUsersByRole("professor") ou getUsersByRole("aluno").
- Cada item mostra name e email.
- Botão + abre tela de registro de novo usuário.
Navegação
- AppRoutes decide se mostra AuthStack (não logado) ou MainTabs (logado).
- MainTabs exibe abas dinâmicas conforme role.
- Stack.Navigator garante navegação hierárquica (ex.: Feed → PostDetail).

# Como usar
## Instalação
git clone https://github.com/JohnnyLima67/BlogApp
cd BlogApp
npm install
## Configuração Firebase
- Crie um projeto no Firebase.
- Ative Auth (Email/Password), Firestore Database e Storage.
- Copie as credenciais para firebaseConfig.ts.
```
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```
## Rodar o app
npx expo start --tunnel
## Fluxo de uso
- Usuário acessa tela de Login/Register.
- Professores podem criar novos usuários sem logar neles.
- Feed mostra posts recentes.
- Professores têm acesso às abas extras.
