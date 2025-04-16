package com.bootcamp.learning.bootcamp.config;


import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.context.annotation.Configuration;

@Aspect
@Configuration
public class AspectConfig {

    @Before("execution(* com.bootcamp.learning.bootcamp.*.*.*(..)")
    public void logBeforeMethod(JoinPoint joinPoint){
        System.out.println("Method Signature:"+joinPoint.getSignature());
    }
}
