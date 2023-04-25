package ru.itmentor.spring.boot_security.demo.controller;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.itmentor.spring.boot_security.demo.model.User;
import ru.itmentor.spring.boot_security.demo.service.RegistrationService;
import ru.itmentor.spring.boot_security.demo.util.UserValidator;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

@RequestMapping("/welcome")
@Controller
public class GuestController {
    private final RegistrationService registrationService;
    private final UserValidator userValidator;
    private final AuthenticationManager authenticationManager;
    private final HttpServletRequest request;
    private final HttpServletResponse response;

    public GuestController(RegistrationService registrationService, UserValidator userValidator, AuthenticationManager authenticationManager, HttpServletRequest request, HttpServletResponse response) {
        this.registrationService = registrationService;
        this.userValidator = userValidator;
        this.authenticationManager = authenticationManager;
        this.request = request;
        this.response = response;
    }


    @GetMapping("/login")
    public String showLoginForm() {
        return "login";
    }

    @PostMapping("/login")
    public String login(@RequestParam String email, @RequestParam String password, Model model) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null) {
                new SecurityContextLogoutHandler().logout(request, response, authentication);
            }
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
            return "redirect:/welcome";
        } catch (BadCredentialsException ex) {
            model.addAttribute("error", "Invalid email or password");
            return "login";
        }
    }

    @GetMapping("/registration")
    public String showRegistration(Model model) {
        model.addAttribute("user", new User());
        return "registration";
    }

    @PostMapping("/registration")
    public String performRegistration(@ModelAttribute("user") @Valid User user, BindingResult bindingResult) {

        userValidator.validate(user, bindingResult);

        if (bindingResult.hasErrors())
            return "/registration";

        registrationService.register(user);

        return "redirect:/welcome";
    }
}
