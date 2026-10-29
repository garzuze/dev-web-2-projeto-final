package br.ufpr.tads.manutencao.auth.service;

import br.ufpr.tads.manutencao.auth.dto.SignUpRequest;
import br.ufpr.tads.manutencao.auth.dto.SignUpResponse;
import br.ufpr.tads.manutencao.auth.exception.CpfAlreadyUsedException;
import br.ufpr.tads.manutencao.auth.exception.EmailAlreadyUsedException;
import br.ufpr.tads.manutencao.request.repository.AddressRepository;
import br.ufpr.tads.manutencao.user.mapper.AddressMapper;
import br.ufpr.tads.manutencao.user.mapper.CustomerMapper;
import br.ufpr.tads.manutencao.user.model.Customer;
import br.ufpr.tads.manutencao.user.repository.CustomerRepository;
import br.ufpr.tads.manutencao.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SignUpService {

  private final UserRepository userRepository;
  private final CustomerRepository customerRepository;
  private final AddressRepository addressRepository;
  private final PasswordService passwordService;
  private final PasswordNotifier passwordNotifier;

  public SignUpService(UserRepository userRepository, CustomerRepository customerRepository,
                       AddressRepository addressRepository, PasswordService passwordService,
                       PasswordNotifier passwordNotifier) {
    this.userRepository = userRepository;
    this.customerRepository = customerRepository;
    this.addressRepository = addressRepository;
    this.passwordService = passwordService;
    this.passwordNotifier = passwordNotifier;
  }

  @Transactional
  public SignUpResponse signUp(SignUpRequest request) {
    String email = request.email().trim().toLowerCase();

    if (userRepository.existsByEmail(email)) {
      throw new EmailAlreadyUsedException(email);
    }
    if (customerRepository.existsByCpf(request.cpf())) {
      throw new CpfAlreadyUsedException(request.cpf());
    }

    String password = passwordService.generateNumericPassword();
    String salt = passwordService.generateSalt();
    String hashedPwd = passwordService.hash(password, salt);

    Customer customer = customerRepository.save(CustomerMapper.toEntity(request, salt, hashedPwd));
    addressRepository.save(AddressMapper.toEntity(request.address(), customer));

    passwordNotifier.send(customer.getEmail(), password);

    return CustomerMapper.toResponse(customer);
  }

}
