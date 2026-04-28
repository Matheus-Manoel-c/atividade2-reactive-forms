import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-agenda',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})
export class Agenda {
  form: FormGroup;
  contatos: any[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      telefone: ['', [Validators.required, this.validarTelefone.bind(this)]],
      email: ['', [Validators.required, Validators.email]]
    });
    this.form.get('telefone')?.valueChanges.subscribe(valor => {
      if (!valor) return;

      const formatado = this.formatarTelefone(valor);

      if (valor !== formatado) {
        this.form.get('telefone')?.setValue(formatado, { emitEvent: false });
      }
    });
  }

  validarTelefone(control: any) {
    if (!control.value) return null;

    const numeros = control.value.replace(/\D/g, '');

    if (numeros.length !== 10 && numeros.length !== 11) {
      return { telefoneInvalido: true };
    }

    return null;
  }

  formatarTelefone(tel: string): string {
    if (!tel) return '';

    tel = tel.replace(/\D/g, '');

    // 🔥 LIMITA A 11 DÍGITOS
    tel = tel.substring(0, 11);

    if (tel.length === 11) {
      return tel.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }

    if (tel.length === 10) {
      return tel.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    if (tel.length > 6) {
      return tel.replace(/(\d{2})(\d{4,5})(\d*)/, '($1) $2-$3');
    }

    if (tel.length > 2) {
      return tel.replace(/(\d{2})(\d*)/, '($1) $2');
    }

    return tel;
  }

  inserir() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.contatos.push({
      nome: this.form.value.nome,
      telefone: this.form.value.telefone,
      email: this.form.value.email,
      editando: false,
      formEdit: this.fb.group({
        nome: [this.form.value.nome, Validators.required],
        telefone: [
          this.form.value.telefone,
          [Validators.required, this.validarTelefone.bind(this)]
        ],
        email: [this.form.value.email, [Validators.required, Validators.email]]
      })
    });

    this.form.reset();
  }

  excluir(index: number) {
    if (confirm('Deseja realmente excluir este contato?')) {
      this.contatos.splice(index, 1);
    }
  }

  editar(contato: any) {
    contato.editando = true;
    contato.formEdit.get('telefone')?.valueChanges.subscribe((valor: string) => {
      if (!valor) return;

      const formatado = this.formatarTelefone(valor);

      if (valor !== formatado) {
        contato.formEdit.get('telefone')?.setValue(formatado, { emitEvent: false });
      }
    });
  }

  salvar(contato: any) {
    const formEdit = contato.formEdit;

    if (formEdit.invalid) {
      formEdit.markAllAsTouched();
      return;
    }

    contato.nome = formEdit.value.nome;
    contato.telefone = formEdit.value.telefone;
    contato.email = formEdit.value.email;

    contato.editando = false;
  }

  cancelar(contato: any) {
    contato.formEdit.setValue({
      nome: contato.nome,
      telefone: contato.telefone,
      email: contato.email
    });

    contato.editando = false;
  }
}