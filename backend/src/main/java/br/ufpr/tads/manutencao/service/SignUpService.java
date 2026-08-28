package br.ufpr.tads.manutencao.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.ufpr.tads.manutencao.dto.AddressRequest;
import br.ufpr.tads.manutencao.dto.SignUpRequest;
import br.ufpr.tads.manutencao.dto.SignUpResponse;
import br.ufpr.tads.manutencao.exception.CpfAlreadyUsedException;
import br.ufpr.tads.manutencao.exception.EmailAlreadyUsedException;
import br.ufpr.tads.manutencao.model.Address;
import br.ufpr.tads.manutencao.model.Customer;
import br.ufpr.tads.manutencao.repository.AddressRepository;
import br.ufpr.tads.manutencao.repository.CustomerRepository;
import br.ufpr.tads.manutencao.repository.UserRepository;

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

        Customer customer = new Customer();
        customer.setName(request.name().trim());
        customer.setEmail(email);
        customer.setCpf(request.cpf());
        customer.setPhone(request.phone());
        customer.setSalt(salt);
        customer.setPasswordHash(passwordService.hash(password, salt));

        Customer saved = customerRepository.save(customer);
        addressRepository.save(newAddress(request.address(), saved));
        passwordNotifier.send(saved.getEmail(), password);

        return new SignUpResponse(saved.getId(), saved.getName(), saved.getEmail());
    }

    private Address newAddress(AddressRequest request, Customer customer) {
        Address address = new Address();
        address.setCustomer(customer);
        address.setZipCode(request.zipCode());
        address.setStreet(request.street());
        address.setNumber(request.number());
        address.setComplement(request.complement());
        address.setDistrict(request.district());
        address.setCity(request.city());
        address.setState(request.state());
        return address;
    }

}
