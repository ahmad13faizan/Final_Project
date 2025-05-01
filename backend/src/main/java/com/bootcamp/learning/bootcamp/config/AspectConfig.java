package com.bootcamp.learning.bootcamp.config;

import com.bootcamp.learning.bootcamp.entity.User;
import com.bootcamp.learning.bootcamp.enums.RoleType;
import com.bootcamp.learning.bootcamp.repository.UserRepository;
import com.bootcamp.learning.bootcamp.service.UserService;
import com.bootcamp.learning.bootcamp.util.AwsHelperService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;

@Aspect
@Configuration
public class AspectConfig {

    @Autowired
    private AwsHelperService awsHelper;

    @Autowired
    UserRepository userRepository;

    public void checkValidCustomer(Long awsAccountId){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        System.out.println("lalala");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        RoleType roleType= user.getRole().getName();
        if(roleType== RoleType.ROLE_ADMIN ||roleType ==RoleType.ROLE_READ_ONLY ){return;}

        boolean ownsAccount = user.getAccounts().stream()
                .anyMatch(account -> account.getAccountId().equals(awsAccountId));

        if (!ownsAccount) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied to AWS Account: " + awsAccountId);
        }
    }



    @Before("execution(* com.bootcamp.learning.bootcamp.controllers.AwsController.get*(..))")
    public void checkCustomer(JoinPoint joinPoint) {
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        Method method = methodSignature.getMethod();
        Object[] args = joinPoint.getArgs();

        Annotation[][] paramAnnotations = method.getParameterAnnotations();

        for (int i = 0; i < paramAnnotations.length; i++) {
            for (Annotation annotation : paramAnnotations[i]) {
                if (annotation instanceof PathVariable && args[i] instanceof Long) {
                    Long id = (Long) args[i];
                    checkValidCustomer(id); // Call your validation here
                    return;
                }
            }
        }
    }
}
