package com.review_app.epr.service;

import com.review_app.epr.entity.Employee;
import com.review_app.epr.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public List<Employee> findAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee saveEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

   //when there is no employee, admin is default
    public Employee loadUserByEmpname(String username) //
    {
        if ("admin".equalsIgnoreCase(username) && employeeRepository.count() == 0) {

            List<SimpleGrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ADMIN"));

            return new Employee(
                    "admin",
                    "admin@company.com","admin");
        }
        return null;
    }
}
