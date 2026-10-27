package com.clinic.appointment.services;

import com.clinic.appointment.dto.LoginReponse;
import com.clinic.appointment.dto.LoginRequest;
import com.clinic.appointment.dto.RegisterRequest;
import com.clinic.appointment.exception.AppException;
import com.clinic.appointment.exception.ErrorCode;
import com.clinic.appointment.model.RefreshToken;
import com.clinic.appointment.model.User;
import com.clinic.appointment.model.UserPrincipal;
import com.clinic.appointment.repository.RefreshTokenRepo;
import com.clinic.appointment.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.RememberMeServices;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JWTService jwtService;
    @Autowired
    private RefreshTokenService refreshTokenService;

    @Value("${jwt.expiration}")
    private int expiration;

    public String register(RegisterRequest register) {
        var usernameExist = userRepo.existsByUsername(register.getUsername());
        if (usernameExist) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }
        var emailExist = userRepo.existsByEmail(register.getEmail());
        if (emailExist) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
        User user = new User(
                register.getFullName(),
                register.getEmail(),
                register.getUsername(),
                passwordEncoder.encode(register.getPassword()),
                register.getPhone()
        );

        userRepo.save(user);
        return "Register Successfully!";
    }

    public LoginReponse login(LoginRequest login) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        login.getUsername(),
                        login.getPassword()
                )
        );

        if (authentication.isAuthenticated()) {

            UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();

            var accessToken = jwtService.generateAccessToken(userDetails.getUser());
            var refreshToken = refreshTokenService.createRefreshToken(userDetails.getUser());

            return new LoginReponse(
                    accessToken,
                    refreshToken,
                    expiration
            );
        }

        throw new AppException(ErrorCode.INVALID_PASSWORD);
    }

    public void logout(String refreshToken) {

        RefreshToken token = refreshTokenService.findByToken(refreshToken);

        if (token == null) {
            throw new AppException(ErrorCode.REFRESH_TOKEN_NOT_FOUND);
        }
        refreshTokenService.delete(refreshToken);
    }
}
