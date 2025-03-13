export const PERMISSIONS = [
  // Raiz
  {
    name: 'Configurações',
    code_name: 'config',
    description: 'Permissão para acessar o módulo Configurações',
    parent: null, // Não tem pai, é a raiz
    moduleAccess: 'ConfigModule', // Nome do módulo
  },

  // Cadastro de Usuários (Filho de Configurações)
  {
    name: 'Cadastro de Usuários',
    code_name: 'config_registerUsers',
    description: 'Permissão para acessar o cadastro de usuários',
    parent: 'config',
    moduleAccess: 'ConfigModule',
  },
  {
    name: 'Usuário',
    code_name: 'config_registerUsers_users',
    description: 'Permissão para abrir o ambiente de usuários',
    parent: 'config_registerUsers',
    moduleAccess: 'ConfigModule',
  },
  {
    name: 'Visualizador',
    code_name: 'config_registerUsers_users_view',
    description: 'Permissão para visualizar todos os usuários',
    parent: 'config_registerUsers_users',
    moduleAccess: 'ConfigModule',
  },
  {
    name: 'Criar',
    code_name: 'config_registerUsers_users_create',
    description: 'Permissão para criar novos usuários',
    parent: 'config_registerUsers_users',
    moduleAccess: 'ConfigModule',
  },
  {
    name: 'Atualizar',
    code_name: 'config_registerUsers_users_update',
    description: 'Permissão para atualizar informações de usuários',
    parent: 'config_registerUsers_users',
    moduleAccess: 'ConfigModule',
  },

  // Cadastro de Grupo de Usuários (Filho de Configurações)
  {
    name: 'Grupo de Usuário',
    code_name: 'config_registerUsers_group',
    description: 'Permissão para abrir o ambiente de grupo de usuário',
    parent: 'config_registerUsers',
    moduleAccess: 'ConfigModule',
  },
  {
    name: 'Visualizador',
    code_name: 'config_registerUsers_group_view',
    description: 'Permissão para visualizar todos os grupos de usuários',
    parent: 'config_registerUsers_group',
    moduleAccess: 'ConfigModule',
  },
  {
    name: 'Criar',
    code_name: 'config_registerUsers_group_create',
    description: 'Permissão para criar novos grupos de usuários',
    parent: 'config_registerUsers_group',
    moduleAccess: 'ConfigModule',
  },
  {
    name: 'Atualizar',
    code_name: 'config_registerUsers_group_update',
    description: 'Permissão para atualizar informações de grupos de usuários',
    parent: 'config_registerUsers_group',
    moduleAccess: 'ConfigModule',
  },
];
