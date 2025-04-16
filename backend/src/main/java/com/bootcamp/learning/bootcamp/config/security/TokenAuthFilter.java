package com.bootcamp.learning.bootcamp.config.security;

import com.bootcamp.learning.bootcamp.UserDetails.CustomUserDetails;
import com.bootcamp.learning.bootcamp.entity.LoginToken;
import com.bootcamp.learning.bootcamp.entity.User;
import com.bootcamp.learning.bootcamp.enums.RoleType;
import com.bootcamp.learning.bootcamp.repository.LoginTokenRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

@Component
public class TokenAuthFilter extends OncePerRequestFilter {

    @Autowired
    private LoginTokenRepository tokenRepository;

    private static final long TOKEN_EXPIRY_MINUTES = 15;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Allow unauthenticated access to /api/login
        if ("/api/login".equals(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = request.getHeader("Authorization");

        if (token == null || token.trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Missing or empty Authorization header.");
            return;
        }

        Optional<LoginToken> loginTokenOpt = tokenRepository.findByToken(token);

        if (loginTokenOpt.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid token.");
            return;
        }

        LoginToken loginToken = loginTokenOpt.get();

        // Check token expiry
        if (loginToken.getCreatedAt().plusMinutes(TOKEN_EXPIRY_MINUTES).isBefore(LocalDateTime.now())) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Token expired. Please login again.");
            return;
        }

        User user = loginToken.getUser();
        RoleType roleType = user.getRole().getName();

        // Create and set Spring Security authentication context
        CustomUserDetails userDetails = new CustomUserDetails(user);
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 🔓 Allow logout for any authenticated user
        if ("/api/logout".equals(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 🔒 For all other endpoints, only allow ADMIN
        if (!RoleType.ROLE_ADMIN.equals(roleType)) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("Access denied. Admin role required.");
            return;
        }

        filterChain.doFilter(request, response);
    }

}
