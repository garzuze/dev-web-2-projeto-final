package br.ufpr.tads.manutencao.auth.service;

import br.ufpr.tads.manutencao.auth.dto.UserProfile;
import br.ufpr.tads.manutencao.utils.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class PasswordNotifier {

  private static final Logger log = LoggerFactory.getLogger(PasswordNotifier.class);

  private final EmailService servicoEmail;

  public PasswordNotifier(EmailService servicoEmail) {
    this.servicoEmail = servicoEmail;
  }

   private String extrairPrimeiroNome(String nomeCompleto) {
      if (nomeCompleto == null || nomeCompleto.isBlank()) {
        return "";
      }

      return nomeCompleto.trim().split("\\s+")[0];
    }

  public void send(String name, String email, String password, UserProfile profile) {
    try {
      log.info("Senha gerada para o email {}: {}", email, password);
      String assunto = "Senha de Acesso - Manutenção Zica 😎";

      String primeiroNome = extrairPrimeiroNome(name);
      String corpo = switch(profile){
        case CUSTOMER ->
        """
              Olá %s!
              
              Muito obrigado por se cadastrar no sistema de manutenção mais zica do Brasil 😎 !!!
              
              Sua senha de acesso é: %s
              
              Utilize a senha fornecida acima junto com seu email para realizar login no sistema.
              """.formatted(primeiroNome, password);

        case EMPLOYEE ->
         """
              Olá %s!
              
              Você foi cadastrado como colaborador no sistema de manutenção mais zica do Brasil 😎 !!!
              
              Sua senha de acesso é: %s
              
              Utilize a senha fornecida acima junto com seu email para realizar login no sistema.
              """.formatted(primeiroNome, password);      
      }; 

      servicoEmail.enviaEmail(email, assunto, corpo);
      log.info("E-mail com senha enviado para: {}", email);
    } catch (Exception e) {
      log.error("Falha no envio de email para {}: {}", email, e.getMessage());
    }

  }

}
