package com.bootcamp.learning.bootcamp.config.security;

import com.bootcamp.learning.bootcamp.UserDetails.CustomUserDetails;
import com.bootcamp.learning.bootcamp.entity.LoginToken;
import com.bootcamp.learning.bootcamp.entity.User;
import com.bootcamp.learning.bootcamp.repository.LoginTokenRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Component
public class TokenAuthFilter extends OncePerRequestFilter {

    private static final long TOKEN_EXPIRY_MINUTES = 15;

    @Autowired private LoginTokenRepository tokenRepository;
    @Autowired private JsonAuthenticationEntryPoint jsonEntryPoint;  // your custom entry-point

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            chain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");
        if (header != null && !header.isBlank()) {
            String token = header.startsWith("Bearer ")
                    ? header.substring(7)
                    : header;

            Optional<LoginToken> opt = tokenRepository.findByToken(token);
            if (opt.isEmpty()) {
                // directly produce 401 JSON
                jsonEntryPoint.commence(
                        request,
                        response,
                        new AuthenticationException("Invalid token") {}
                );
                return;
            }

            LoginToken loginToken = opt.get();
            if (loginToken.getCreatedAt().plusMinutes(TOKEN_EXPIRY_MINUTES)
                    .isBefore(LocalDateTime.now())) {
                jsonEntryPoint.commence(
                        request,
                        response,
                        new AuthenticationException("Token expired") {}
                );
                return;
            }

            // ✅ valid token, set authentication
            User user = loginToken.getUser();
            var authority = new SimpleGrantedAuthority(user.getRole().getName().name());
            var auth = new UsernamePasswordAuthenticationToken(
                    new CustomUserDetails(user),
                    null,
                    List.of(authority));
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        chain.doFilter(request, response);
    }
}
