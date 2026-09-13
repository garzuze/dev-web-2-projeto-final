package br.ufpr.tads.manutencao.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class PasswordNotifier {

    private static final Logger log = LoggerFactory.getLogger(PasswordNotifier.class);

    private final EmailService servicoEmail;

    public PasswordNotifier(EmailService servicoEmail){
        this.servicoEmail = servicoEmail;
    }

    public void send(String email, String password) {
        try {
            log.info("Generated password for {}: {}", email, password);
            String assunto = "Senha de Acesso - Manutenção Zica 😎";    
            String corpo = """
                    Olá!
                    
                    Muito obrigado por se cadastrar no sistema de manutenção mais zica do Brasil 😎 !!!

                    Sua senha de acesso é: %s

                    Utilize a senha fornecida acima junto com seu email para realizar login no sistema.
                    """.formatted(password);

                    servicoEmail.enviaEmail(email, assunto, corpo);
                    log.info("E-mail com senha enviado para: {}", email);
        } catch (Exception e) {
            log.error("Falha no envio de email para {}: {}", email, e.getMessage());
            log.info("Generated password for {}: {}", email, password);
        }
        
    }

}
