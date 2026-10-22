 import { AbstractControl, ValidationErrors } from '@angular/forms';
    
    const TAMANHO_CPF = 11;
    const SEQUENCIA_REPETIDA_REGEX = /^(.)\1*$/;
    
    function calcularDigito(digitos: number[], pesoInicial: number): number {
      const soma = digitos.reduce((total, digito, index) => {
        return total + digito * (pesoInicial - index);
      }, 0);
    
      const resto = soma % 11;
      return resto < 2 ? 0 : 11 - resto;
    }
    
    export function cpfValidator(control: AbstractControl): ValidationErrors | null {
      if (!control.value) {
        return null;
      }
    
      const cpfLimpo = String(control.value).replace(/\D/g, '');
    
      if (cpfLimpo.length !== TAMANHO_CPF || SEQUENCIA_REPETIDA_REGEX.test(cpfLimpo)) {
        return { cpfInvalido: true };
      }
    
      const digitos = cpfLimpo.split('').map(Number);
    
      const dv1Valido = calcularDigito(digitos.slice(0, 9), 10) === digitos[9];
      const dv2Valido = calcularDigito(digitos.slice(0, 10), 11) === digitos[10];
    
      if (!dv1Valido || !dv2Valido) {
        return { cpfInvalido: true };
      }
    
      return null;
    }