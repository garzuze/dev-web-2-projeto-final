package br.ufpr.tads.manutencao.controller;

    import java.util.List;
    
    import org.springframework.http.HttpStatus;
    import org.springframework.web.bind.annotation.DeleteMapping;
    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.PathVariable;
    import org.springframework.web.bind.annotation.PostMapping;
    import org.springframework.web.bind.annotation.PutMapping;
    import org.springframework.web.bind.annotation.RequestBody;
    import org.springframework.web.bind.annotation.RequestHeader;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.bind.annotation.ResponseStatus;
    import org.springframework.web.bind.annotation.RestController;
    
    import br.ufpr.tads.manutencao.dto.EmployeeRequest;
    import br.ufpr.tads.manutencao.dto.EmployeeResponse;
    import br.ufpr.tads.manutencao.service.EmployeeService;
    import jakarta.validation.Valid;
    
    @RestController
    @RequestMapping("/api/employees")
    public class EmployeeController {
    
        private final EmployeeService employeeService;
    
        public EmployeeController(EmployeeService employeeService) {
            this.employeeService = employeeService;
        }
    
        @GetMapping
        public List<EmployeeResponse> list() {
            return employeeService.list();
        }
    
        @PostMapping
        @ResponseStatus(HttpStatus.CREATED)
        public EmployeeResponse create(@Valid @RequestBody EmployeeRequest request) {
            return employeeService.create(request);
        }
    
        @PutMapping("/{id}")
        public EmployeeResponse update(@PathVariable Long id, @Valid @RequestBody EmployeeRequest request) {
            return employeeService.update(id, request);
        }
    
        @DeleteMapping("/{id}")
        @ResponseStatus(HttpStatus.NO_CONTENT)
        public void deactivate(@PathVariable Long id,
                               @RequestHeader(value = "X-Current-User-Id", required = false) Long currentUserId) {
            employeeService.deactivate(id, currentUserId);
        }

    }
