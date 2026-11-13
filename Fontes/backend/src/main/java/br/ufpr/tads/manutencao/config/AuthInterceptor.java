package br.ufpr.tads.manutencao.config;

import br.ufpr.tads.manutencao.auth.dto.LoginResponse;
import br.ufpr.tads.manutencao.auth.dto.UserProfile;
import br.ufpr.tads.manutencao.auth.service.TokenStore;
import br.ufpr.tads.manutencao.category.controller.CategoryController;
import br.ufpr.tads.manutencao.report.controller.ReportController;
import br.ufpr.tads.manutencao.request.controller.EmployeeRequestController;
import br.ufpr.tads.manutencao.request.controller.MaintenanceRequestController;
import br.ufpr.tads.manutencao.user.controller.EmployeeController;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AuthInterceptor implements HandlerInterceptor, WebMvcConfigurer {

  private final TokenStore tokenStore;

  public AuthInterceptor(TokenStore tokenStore) {
    this.tokenStore = tokenStore;
  }

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(this).addPathPatterns("/api/**").excludePathPatterns("/api/auth/**");
  }

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
    if (CorsUtils.isPreFlightRequest(request)) {
      return true;
    }

    String header = request.getHeader("Authorization");
    LoginResponse user = tokenStore.find(header == null ? null : header.replace("Bearer ", ""));
    if (user == null) {
      response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
      return false;
    }

    Class<?> controller = handler instanceof HandlerMethod method ? method.getBeanType() : null;
    boolean employeeOnly = controller == EmployeeRequestController.class
            || controller == EmployeeController.class
            || controller == ReportController.class
            || (controller == CategoryController.class && !"GET".equals(request.getMethod()));
    boolean customerOnly = controller == MaintenanceRequestController.class;
    boolean wrongProfile = (employeeOnly && user.profile() != UserProfile.EMPLOYEE)
            || (customerOnly && user.profile() != UserProfile.CUSTOMER);
    boolean wrongUser = !String.valueOf(user.id()).equals(request.getHeader("X-Current-User-Id"));

    if (wrongProfile || wrongUser) {
      response.setStatus(HttpServletResponse.SC_FORBIDDEN);
      return false;
    }
    return true;
  }

}
