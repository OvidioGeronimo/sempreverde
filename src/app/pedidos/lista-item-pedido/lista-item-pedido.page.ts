import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CarrinhoService } from '../shared/carrinho.service';
import { AlertService } from 'src/app/core/shared/alert.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from 'src/app/core/shared/toast.service';
import { Router } from '@angular/router';
import { PedidoService } from '../shared/pedido.service';


@Component({
  selector: 'app-lista-item-pedido',
  templateUrl: './lista-item-pedido.page.html',
  styleUrls: ['./lista-item-pedido.page.scss'],
})
export class ListaItemPedidoPage implements OnInit {
itensPedido: Observable<any[]>;
total: number;
form: FormGroup;


  constructor(private carrinhoService: CarrinhoService,
              private alert: AlertService,
              private formBuilder: FormBuilder,
              private toast: ToastService,
              private router: Router,
              private pedidoService: PedidoService
              ) { }

  ngOnInit() {
    this.itensPedido = this.carrinhoService.getAll();
    this.getTotalPedido();
  }

  getTotalPedido() {
    const subscribe = this.carrinhoService.getTotalPedido().subscribe( (total: number) => {
      subscribe.unsubscribe();
      this.total = total;
    })
  }

  adicionarQuantidade(itemPedido: any){
    let qtd = itemPedido.quantidade;
    qtd++;

    this.atualizarTotal(itemPedido, qtd);
  }

  removerQuantidade(itemPedido: any) {
    let qtd = itemPedido.quantidade;
    qtd--;

    if (qtd <=0){
      this.removerProduto(itemPedido);
    } else {
      this.atualizarTotal(itemPedido, qtd);
    }
  }

  atualizarTotal(itemPedido: any, quantidade: number){
    const total = this.carrinhoService.calcularTotal(itemPedido.produtoPreco, quantidade);
    this.carrinhoService.update(itemPedido.key, quantidade, total);
    this.getTotalPedido();
  }

  removerProduto(itemPedido: any){
    this.alert.ShowConfirmaExclusao(itemPedido.produtoNome, () =>{
      this.carrinhoService.remove(itemPedido.key);
      this.getTotalPedido();
    })

  }

  onSubmit(){
    // if(this.form.valid){
  this.pedidoService.gerarPedido()//acho q tenho q remover o form ou colocar o .pedido
        .then(() => {
          this.toast.show('Pedido salvo com sucesso. Aguarde a confirmação.');
          this.router.navigate(['/tabs/produtos']);
        })
        .catch( () => {
          this.toast.show('Erro ao salvar o pedido');
        });
  }

  criarFormulario(){
    this.form = this.formBuilder.group({
      total: ['']
    });
  }

}