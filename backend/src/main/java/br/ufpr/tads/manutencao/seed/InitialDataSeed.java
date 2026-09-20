package br.ufpr.tads.manutencao.seed;

import java.time.LocalDate;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import br.ufpr.tads.manutencao.model.Address;
import br.ufpr.tads.manutencao.model.Category;
import br.ufpr.tads.manutencao.model.Customer;
import br.ufpr.tads.manutencao.model.Employee;
import br.ufpr.tads.manutencao.repository.AddressRepository;
import br.ufpr.tads.manutencao.repository.CategoryRepository;
import br.ufpr.tads.manutencao.repository.CustomerRepository;
import br.ufpr.tads.manutencao.repository.EmployeeRepository;
import br.ufpr.tads.manutencao.repository.UserRepository;
import br.ufpr.tads.manutencao.service.PasswordService;

@Component
public class InitialDataSeed implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(InitialDataSeed.class);

    private final CategoryRepository categoryRepository;
    private final EmployeeRepository employeeRepository;
    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final PasswordService passwordService;

    public InitialDataSeed(CategoryRepository categoryRepository, EmployeeRepository employeeRepository,
            CustomerRepository customerRepository, UserRepository userRepository, AddressRepository addressRepository,
            PasswordService passwordService) {
        this.categoryRepository = categoryRepository;
        this.employeeRepository = employeeRepository;
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.passwordService = passwordService;
    }

    @Override
    public void run(String... args) throws Exception {
        popularFuncionarios();
        popularClientes();
        popularCategorias();

    }

    private record seedFuncionario(
            String name,
            String email,
            LocalDate birthDate,
            String password) {
    }

    private record seedClientes(
            String name,
            String email,
            String cpf,
            String phone,
            String password,
            String zipCode,
            String street,
            String number,
            String district,
            String city,
            String state) {
    }

    private void popularFuncionarios() {
        List<seedFuncionario> funcionariosParaInserir = List.of(
                new seedFuncionario("Maria Silva", "maria@empresa.com", LocalDate.of(1990, 5, 15), "0001"),
                new seedFuncionario("Mário Santos", "mario@empresa.com", LocalDate.of(1988, 8, 20), "0002"));

        for (seedFuncionario registroFuncionario : funcionariosParaInserir) {
            if (!userRepository.existsByEmail(registroFuncionario.email())) {
                String salt = passwordService.generateSalt();
                Employee funcionario = new Employee();

                funcionario.setName(registroFuncionario.name());
                funcionario.setEmail(registroFuncionario.email());
                funcionario.setBirthDate(registroFuncionario.birthDate());
                funcionario.setSalt(salt);
                funcionario.setPasswordHash(passwordService.hash(registroFuncionario.password(), salt));

                employeeRepository.save(funcionario);

                log.info("[SEED] Funcionário criado: {}", funcionario.getName());
            }
        }
    }

    private void popularClientes() {
        List<seedClientes> clientesParaInserir = List.of(
                new seedClientes(
                        "João da Silva",
                        "joao@cliente.com",
                        "11122233344",
                        "41988881111",
                        "0001",
                        "80060000",
                        "Rua XV de Novembro",
                        "150",
                        "Centro",
                        "Curitiba",
                        "PR"),
                new seedClientes(
                        "José Pereira",
                        "jose@cliente.com",
                        "22233344455",
                        "41988882222",
                        "0002",
                        "80240000",
                        "Avenida Sete de Setembro",
                        "2500",
                        "Batel",
                        "Curitiba",
                        "PR"),
                new seedClientes(
                        "Joana Martins",
                        "joana@cliente.com",
                        "33344455566",
                        "41988883333",
                        "0003",
                        "80020310",
                        "Rua Marechal Deodoro",
                        "450",
                        "Centro",
                        "Curitiba",
                        "PR"),
                new seedClientes(
                        "Joaquina Souza",
                        "joaquina@cliente.com",
                        "44455566677",
                        "41988884444",
                        "0004",
                        "81530000",
                        "Avenida Coronel Francisco H. dos Santos",
                        "100",
                        "Jardim das Américas",
                        "Curitiba",
                        "PR"));
        for (seedClientes registroCliente : clientesParaInserir) {
            if (!userRepository.existsByEmail(registroCliente.email())) {
                String salt = passwordService.generateSalt();

                Customer cliente = new Customer();
                cliente.setName(registroCliente.name());
                cliente.setEmail(registroCliente.email());
                cliente.setCpf(registroCliente.cpf());
                cliente.setPhone(registroCliente.phone());
                cliente.setSalt(salt);
                cliente.setPasswordHash(passwordService.hash(registroCliente.password(), salt));

                Customer clienteSalvo = customerRepository.save(cliente);

                Address endereco = new Address();
                endereco.setCustomer(clienteSalvo);
                endereco.setZipCode(registroCliente.zipCode());
                endereco.setStreet(registroCliente.street());
                endereco.setNumber(registroCliente.number());
                endereco.setDistrict(registroCliente.district());
                endereco.setCity(registroCliente.city());
                endereco.setState(registroCliente.state());

                addressRepository.save(endereco);

                log.info("[SEED] Cliente criado: {}", clienteSalvo.getName());
            }
            
        }                

    }

    private void popularCategorias(){
        List<String> categoriasParaInserir = List.of(
            "Notebook",
            "Desktop",
            "Impressora",
            "Mouse",
            "Teclado"
        );

        for (String nome : categoriasParaInserir) {
            if (categoryRepository.findByNameIgnoreCaseAndActiveTrue(nome).isEmpty()) {
                Category categoria = new Category();
                categoria.setName(nome);
                categoryRepository.save(categoria);

                log.info("[SEED] Categoria criada: {}", nome);
            }
        }
    }
}
