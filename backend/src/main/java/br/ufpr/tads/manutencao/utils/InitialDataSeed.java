package br.ufpr.tads.manutencao.utils;

import br.ufpr.tads.manutencao.auth.service.PasswordService;
import br.ufpr.tads.manutencao.category.model.Category;
import br.ufpr.tads.manutencao.category.repository.CategoryRepository;
import br.ufpr.tads.manutencao.request.MaintenanceRequestMapper;
import br.ufpr.tads.manutencao.request.dto.CreateRequestHistory;
import br.ufpr.tads.manutencao.request.model.MaintenanceRequest;
import br.ufpr.tads.manutencao.request.repository.AddressRepository;
import br.ufpr.tads.manutencao.request.repository.MaintenanceRequestRepository;
import br.ufpr.tads.manutencao.request.service.RequestHistoryService;
import br.ufpr.tads.manutencao.user.model.Address;
import br.ufpr.tads.manutencao.user.model.Customer;
import br.ufpr.tads.manutencao.user.model.Employee;
import br.ufpr.tads.manutencao.user.repository.CustomerRepository;
import br.ufpr.tads.manutencao.user.repository.EmployeeRepository;
import br.ufpr.tads.manutencao.user.repository.UserRepository;
import br.ufpr.tads.manutencao.utils.dto.SeedRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static br.ufpr.tads.manutencao.request.model.RequestStatus.*;

@Component
public class InitialDataSeed implements CommandLineRunner {

  private static final Logger log = LoggerFactory.getLogger(InitialDataSeed.class);

  private final CategoryRepository categoryRepository;
  private final EmployeeRepository employeeRepository;
  private final CustomerRepository customerRepository;
  private final UserRepository userRepository;
  private final AddressRepository addressRepository;
  private final PasswordService passwordService;
  private final MaintenanceRequestRepository requestRepository;
  private final RequestHistoryService historyService;

  public InitialDataSeed(CategoryRepository categoryRepository, EmployeeRepository employeeRepository,
                         CustomerRepository customerRepository, UserRepository userRepository, AddressRepository addressRepository,
                         PasswordService passwordService, MaintenanceRequestRepository requestRepository,
                         RequestHistoryService historyService) {
    this.categoryRepository = categoryRepository;
    this.employeeRepository = employeeRepository;
    this.customerRepository = customerRepository;
    this.userRepository = userRepository;
    this.addressRepository = addressRepository;
    this.passwordService = passwordService;
    this.requestRepository = requestRepository;
    this.historyService = historyService;
  }

  @Override
  public void run(String... args) throws Exception {
    popularFuncionarios();
    popularClientes();
    popularCategorias();
    popularSolicitacoes();
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

  private void popularCategorias() {
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

  private void popularSolicitacoes() {
    if (requestRepository.count() > 0) {
      log.info("Pulando seed de solicitações...");
      return;
    }

    // usa os mesmos funcionários, clientes e categorias criados pela seed do yohan

    Employee maria = findEmployee("maria@empresa.com");
    Employee mario = findEmployee("mario@empresa.com");

    Customer joao = findClient("joao@cliente.com");
    Customer jose = findClient("jose@cliente.com");
    Customer joana = findClient("joana@cliente.com");
    Customer joaquina = findClient("joaquina@cliente.com");

    Category notebook = findCategory("Notebook");
    Category desktop = findCategory("Desktop");
    Category impressora = findCategory("Impressora");
    Category mouse = findCategory("Mouse");
    Category teclado = findCategory("Teclado");

    List.of(
            // aberta
            new SeedRequest(joao, notebook, "Notebook Dell", "Não liga, muito bizarro", ABERTA, null, null, null, 0),
            new SeedRequest(joana, impressora, "Impressora HP", "Acho que impressoras naõ foram feitas para funcionar", ABERTA, null, null, null, 2),
            new SeedRequest(jose, desktop, "Computador desktop", "WINDOWS NÃO FUNCIONA!!! TELA AZUL", ABERTA, null, null, null, 5),
            // orçada
            new SeedRequest(joaquina, notebook, "MacBook M5", "Tela de retina quebrou", ORCADA, maria, null, "250.00", 3),
            new SeedRequest(joao, teclado, "Teclado mecânico", "MEU TECLADO FOI INFECTADO COM UM VÍRUS QUE DEIXA TUDO EM CAPS", ORCADA, mario, null, "80.00", 4),
            new SeedRequest(jose, mouse, "Mouse Logitech", "Aquela bolinha que fica do lado não funciona, mas eu nem uso", ORCADA, maria, null, "45.00", 6),
            // rejeitada
            new SeedRequest(joana, desktop, "Desktop Dell", "Não dá vídeo no monitor!!!", REJEITADA, mario, null, "400.00", 8),
            new SeedRequest(joaquina, impressora, "Impressora Epson", "Não imprime... Já tentei de tudo já chutei e nada", REJEITADA, maria, null, "180.00", 10),
            // aprovada
            new SeedRequest(joao, desktop, "Desktop Lenovo", "Demora muito para ligar, dá tempo de tomar café e quando tá chegando o almoço ele liga", APROVADA, mario, null, "320.00", 12),
            new SeedRequest(jose, notebook, "Notebook Samsung", "Bateria não carrega por nada", APROVADA, maria, null, "500.00", 15),
            new SeedRequest(joana, teclado, "Teclado gamer RGB", "Está faltando a cor azul!! Ele virou um teclado RG.", APROVADA, mario, null, "90.00", 18),
            // redirecionada
            new SeedRequest(joaquina, notebook, "Notebook Lenovo", "Faz tanto barulho que os vizinhos acharam que eu comprei um Opala", REDIRECIONADA, maria, mario, "150.00", 20),
            new SeedRequest(joao, impressora, "Impressora Canon", "Por que que eu fui comprar uma impressora de marca de câmera?", REDIRECIONADA, mario, maria, "220.00", 22),
            // arrumada
            new SeedRequest(jose, impressora, "Impressora HP", "HP deve significar Horrível imPressão", ARRUMADA, maria, null, "130.00", 25),
            new SeedRequest(joana, notebook, "Notebook Asus", "Ganhou Asus e voou para o céu", ARRUMADA, mario, null, "600.00", 28),
            new SeedRequest(joaquina, mouse, "Mouse sem fio", "Só funciona quando eu conecto o fio", ARRUMADA, maria, null, "35.00", 30),
            // paga
            new SeedRequest(joao, desktop, "Desktop gamer", "Não roda GTA VI", PAGA, mario, null, "280.00", 35),
            new SeedRequest(joana, teclado, "Teclado de computador", "Barulho muito alto vou digitair de noite e faz TEC TEC TEC", PAGA, maria, null, "70.00", 38),
            // finalizada
            new SeedRequest(jose, notebook, "Notebook Positivo", "Windows travando... Windows...", FINALIZADA, maria, null, "150.00", 42),
            new SeedRequest(joaquina, desktop, "Desktop HP", "Windows travando de novo... Windows...", FINALIZADA, mario, null, "450.00", 45),
            new SeedRequest(joao, impressora, "Impressora Samsung", "Achei que só faziam celulares e estava certo. Que impressora ruim!", FINALIZADA, maria, null, "90.00", 48),
            new SeedRequest(joana, mouse, "Mouse gamer", "Comprei esse mouse e continuo ruim no CS", FINALIZADA, mario, null, "40.00", 50)
    ).forEach(this::createRequest);

    log.info("Seed de solicitações criada!!");
  }

  private void createRequest(SeedRequest s) {
    LocalDateTime openingDate = daysBefore(s.dias());
    // todas sempre vão passar pelo estado de aberta
    MaintenanceRequest r = MaintenanceRequestMapper.toEntity(s.customer(), s.category(), s.equipment(),
            s.description(), ABERTA, openingDate);

    CreateRequestHistory opening = new CreateRequestHistory(r, null, ABERTA, s.customer(), null,
            "Solicitação aberta pelo cliente.");
    historyService.register(opening, openingDate);

    // aquelas que vierem com status aberta da DTO param aqui
    // as outras vão seguindo o fluxo de acordo
    if (s.state() == ABERTA) {
      requestRepository.save(r);
      return;
    }
    r.setStatus(ORCADA);
    r.setQuoteValue(new BigDecimal(s.value()));
    r.setEmployee(s.employee());
    CreateRequestHistory quote = new CreateRequestHistory(r, ABERTA, ORCADA, s.employee(), null,
            "Orçamento realizado pelo funcionário.");
    historyService.register(quote, openingDate.plusDays(1));
    if (s.state() == ORCADA) {
      requestRepository.save(r);
      return;
    }

    if (s.state() == REJEITADA) {
      r.setStatus(REJEITADA);
      r.setRejectionReason("Orçamento recusado pelo cliente.");
      CreateRequestHistory rejection = new CreateRequestHistory(r, ORCADA, REJEITADA, s.customer(), null,
              "Serviço Rejeitado pelo cliente.");
      historyService.register(rejection, openingDate.plusDays(2));
      requestRepository.save(r);
      return;
    }

    r.setStatus(APROVADA);
    CreateRequestHistory approval = new CreateRequestHistory(r, ORCADA, APROVADA, s.customer(), null,
            "Orçamento aprovado pelo cliente.");
    historyService.register(approval, openingDate.plusDays(2));
    if (s.state() == APROVADA) {
      requestRepository.save(r);
      return;
    }

    if (s.state() == REDIRECIONADA) {
      r.setStatus(REDIRECIONADA);
      r.setEmployee(s.destinyEmployee());
      CreateRequestHistory redirect = new CreateRequestHistory(r, APROVADA, REDIRECIONADA, s.employee(), s.destinyEmployee(),
              "Manutenção redirecionada de " + s.employee().getName() + " para " + s.destinyEmployee().getName() + ".");
      historyService.register(redirect, openingDate.plusDays(3));
      requestRepository.save(r);
      return;
    }

    r.setStatus(ARRUMADA);
    r.setMaintenanceDescription("Manutenção realizada conforme orçamento.");
    r.setCustomerInstructions("Equipamento revisado e testado.");
    r.setEmployee(s.employee());
    CreateRequestHistory maintenance = new CreateRequestHistory(r, APROVADA, ARRUMADA, s.employee(), null,
            "Manutenção realizada pelo funcionário.");
    historyService.register(maintenance, openingDate.plusDays(3));
    if (s.state() == ARRUMADA) {
      requestRepository.save(r);
      return;
    }

    r.setStatus(PAGA);
    r.setPaymentDateTime(openingDate.plusDays(4));
    CreateRequestHistory payment = new CreateRequestHistory(r, ARRUMADA, PAGA, s.customer(), null,
            "Pagamento efetuado pelo cliente.");
    historyService.register(payment, openingDate.plusDays(4));
    if (s.state() == PAGA) {
      requestRepository.save(r);
      return;
    }

    r.setStatus(FINALIZADA);
    CreateRequestHistory finish = new CreateRequestHistory(r, PAGA, FINALIZADA, s.employee(), null,
            "Solicitação finalizada pelo funcionário.");
    historyService.register(finish, openingDate.plusDays(5));
    requestRepository.save(r);
  }

  private Employee findEmployee(String email) {
    return (Employee) userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalStateException("Funcionário seed não encontrado: " + email));
  }

  private Customer findClient(String email) {
    return (Customer) userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalStateException("Cliente seed não encontrado: " + email));
  }

  private Category findCategory(String nome) {
    return categoryRepository.findByNameIgnoreCaseAndActiveTrue(nome)
            .orElseThrow(() -> new IllegalStateException("Categoria seed não encontrada: " + nome));
  }

  private static LocalDateTime daysBefore(int days) {
    return LocalDateTime.now().minusDays(days).minusHours(1);
  }

}
