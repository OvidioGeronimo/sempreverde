import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { CarrinhoService } from './carrinho.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { DatePipe } from '@angular/common';
import { FirebasePath } from 'src/app/core/shared/firebase-path';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  mesastatus: string = '10';
  total: number;

  public static TIPO_FORMA_PAGAMENTO = {
    DINHEIRO: 1,
    CARTAO: 2
  };

  public static STATUS = {
    ENVIADO: 0,
    CONFIRMADO: 1,
    SAIU_PARA_ENTREGA: 2,
    ENTREGUE: 3
  };

  constructor(private db: AngularFireDatabase,
              private afAuth: AngularFireAuth,
              private carrinhoService: CarrinhoService,
              private dateFormat: DatePipe) { }

    getTotalPedido() {
         const subscribe = this.carrinhoService.getTotalPedido().subscribe( (total: number) => {
               subscribe.unsubscribe();
               this.total = total;
          })
    }
            

    gerarPedido(){
      return new Promise( (resolve, reject) => {
        const subscribe = this.carrinhoService.getAll().subscribe(produtos => {
          subscribe.unsubscribe();
  
          const pedidoRef = this.criarObjetoPedido();
          const pedidoKey = this.db.createPushId();
          const pedidoPath = `${FirebasePath.PEDIDOS}${pedidoKey}`;
  
          let pedidoObj = {};
          pedidoObj[pedidoPath] = pedidoRef;
  
          produtos.forEach( (produto: any) => {
            const pedidoProdutoPath = `${FirebasePath.PEDIDOS_PRODUTOS}${pedidoKey}/${produto.produtoKey}`;
            pedidoObj[pedidoProdutoPath] = {
              produtoNome: produto.produtoNome,
              produtoDescricao: produto.produtoDescricao,
              observacao: produto.observacao,
              produtoPreco: produto.produtoPreco,
              quantidade: produto.quantidade,
              total: produto.total
            };
          });
  
          this.db.object('/').update(pedidoObj)
            .then(() => {
              this.carrinhoService.clear()
                .then(() => resolve())
                .catch(() => reject ());
            })
            .catch( () => reject());
        })
      })
    }

    private criarObjetoPedido(){
      const numeroPedido = '#' + this.dateFormat.transform(new Date(), 'ddMMyyyyHHmmss');
      const dataPedido = this.dateFormat.transform(new Date(), 'dd/MM/yyyy');
      this.getTotalPedido();
      
      let pedidoRef = {
        numero: numeroPedido,
        status: PedidoService.STATUS.ENVIADO,
        data: dataPedido,
        mesa: '10',
        // Tecnica para filtro de varios campos
        mesaStatus: this.mesastatus + '_' + PedidoService.STATUS.ENVIADO,
        total: this.total
      }
      return pedidoRef;
    }

    getStatusNome(status: number) {
      switch (status) {
        case PedidoService.STATUS.ENVIADO:
          return 'Aguardando confirmação';
        case PedidoService.STATUS.CONFIRMADO:
          return 'Em preparação';
        case PedidoService.STATUS.SAIU_PARA_ENTREGA:
          return 'Saiu para mesa';
        case PedidoService.STATUS.ENTREGUE:
          return 'Entregue';
      }
    }

    getFormaPagamentoNome(paymentType: number){
      switch(paymentType){
        case PedidoService.TIPO_FORMA_PAGAMENTO.DINHEIRO:
          return 'Dinheiro';
        case PedidoService.TIPO_FORMA_PAGAMENTO.CARTAO:
          return 'Cartão de crédito/débito';
      }
    }

    getAll() {
      return this.db.list(FirebasePath.PEDIDOS,
        q => q.orderByChild('usuarioKey').endAt(this.afAuth.auth.currentUser.uid))
        .snapshotChanges().pipe(
          map(changes => {
            return changes.map(m => ({ key: m.payload.key, ...m.payload.val() }) )
          })
        )
    }

    getAllAbertos(){
      const usuarioStatus = this.afAuth.auth.currentUser.uid + '_' + PedidoService.STATUS.SAIU_PARA_ENTREGA;
      return this.db.list(FirebasePath.PEDIDOS,
        q => q.orderByChild('usuarioStatus').endAt(usuarioStatus))
        .snapshotChanges().pipe(
          map(changes => {
            return changes.map(m => ({ key: m.payload.key, ...m.payload.val() }))
          })
        )
    }

    getAllProdutos(key: string){
      const path = `${FirebasePath.PEDIDOS_PRODUTOS}${key}`;
      return this.db.list(path).snapshotChanges().pipe(
        map(changes => {
          return changes.map(m => ({ key: m.payload.key, ...m.payload.val() }))
        })
      )
    }

}
