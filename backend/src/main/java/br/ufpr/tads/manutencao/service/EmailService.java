package br.ufpr.tads.manutencao.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service 
public class EmailService {
    private final JavaMailSender enviadorEmail;

    @Value("${app.mail.from}")  
    private String remetente;

    public EmailService(JavaMailSender enviadorEmail){
        this.enviadorEmail = enviadorEmail ;
    }

    public void enviaEmail(String para, String assunto, String corpo){
        SimpleMailMessage email = new SimpleMailMessage();
        email.setFrom(remetente); 
        email.setTo(para);
        email.setSubject(assunto);
        email.setText(corpo);
        enviadorEmail.send(email);
    }
}
