package ru.itmentor.spring.boot_security.demo.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.itmentor.spring.boot_security.demo.model.User;
import ru.itmentor.spring.boot_security.demo.service.UserService;


@RequestMapping("/user")
@Controller
@PreAuthorize("hasAnyRole('ADMIN', 'USER')")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("")
    public String UserPage(Model model, Authentication authentication) {
        String email = authentication.getName();
        User newUser = userService.getUserByEmail(email);
        model.addAttribute("user", newUser);
        model.addAttribute("roles", newUser.getRoles());
        return "userPage";
    }
}
