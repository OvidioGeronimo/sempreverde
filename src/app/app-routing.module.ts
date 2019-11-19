import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    // loadChildren: './tabs/tabs.module#TabsPageModule'
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { path: 'form-item-pedido', loadChildren: './pedidos/form-item-pedido/form-item-pedido.module#FormItemPedidoPageModule' },
  { path: 'lista-pedido', loadChildren: './pedidos/lista-pedido/lista-pedido.module#ListaPedidoPageModule' },
  { path: 'lista-produto-pedido', loadChildren: './pedidos/lista-produto-pedido/lista-produto-pedido.module#ListaProdutoPedidoPageModule' },
  { path: 'lista-item-pedido', loadChildren: './pedidos/lista-item-pedido/lista-item-pedido.module#ListaItemPedidoPageModule' },
  { path: 'form-pagamento', loadChildren: './pedidos/form-pagamento/form-pagamento.module#FormPagamentoPageModule' },
  { path: 'criar-mesas', loadChildren: './mesas/criar-mesas/criar-mesas.module#CriarMesasPageModule' },
  { path: 'esqueci-senha', loadChildren: './mesas/esqueci-senha/esqueci-senha.module#EsqueciSenhaPageModule' },
  { path: 'login', loadChildren: './mesas/login/login.module#LoginPageModule' },
  { path: 'perfil', loadChildren: './mesas/perfil/perfil.module#PerfilPageModule' },
  { path: 'form-endereco', loadChildren: './enderecos/form-endereco/form-endereco.module#FormEnderecoPageModule' },
  { path: 'lista-endereco', loadChildren: './enderecos/lista-endereco/lista-endereco.module#ListaEnderecoPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
