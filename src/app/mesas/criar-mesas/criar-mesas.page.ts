import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastService } from 'src/app/core/shared/toast.service';
import { Router } from '@angular/router';
import { UsuariosService } from '../shared/usuarios.service';

@Component({
  selector: 'app-criar-conta',
  templateUrl: './criar-mesas.page.html',
  styleUrls: ['./criar-mesas.page.scss'],
})
export class CriarMesasPage implements OnInit {
formCriarConta: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private toast: ToastService,
              private router: Router,
              private usuariosService: UsuariosService) { }

              ngOnInit() {
                this.criarFormulario();
              }
            
              get nome() { return this.formCriarConta.get('nome'); }
              get email() { return this.formCriarConta.get('email'); }
              get senha() { return this.formCriarConta.get('senha'); }
            
              criarFormulario() {
                this.formCriarConta = this.formBuilder.group({
                  nome: ['', [Validators.required,Validators.minLength(5)]],
                  email: ['', [Validators.required, Validators.email]],
                  senha: ['', Validators.required]
                });
              }  
            
              onSubmit(){
                if (this.formCriarConta.valid) {
                  this.usuariosService.criarConta(this.formCriarConta.value)
                    .then(() => {
                      this.toast.show('Sua conta foi criada com sucesso. Verifique seu Email!');
                      this.router.navigate(['/']);
                    })
                    .catch(mensagem => {
                      this.toast.show(mensagem);
                    });
                }    
              }
            
            }
