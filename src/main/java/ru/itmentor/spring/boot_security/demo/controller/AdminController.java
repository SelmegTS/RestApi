package ru.itmentor.spring.boot_security.demo.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.itmentor.spring.boot_security.demo.model.Role;
import ru.itmentor.spring.boot_security.demo.model.User;
import ru.itmentor.spring.boot_security.demo.service.UserService;
import ru.itmentor.spring.boot_security.demo.util.UserValidator;

import javax.validation.Valid;
import java.util.HashSet;
import java.util.Set;


@Controller
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;
    private final UserValidator userValidator;
    private final PasswordEncoder passwordEncoder;


    public AdminController(UserService userService, UserValidator userValidator, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.userValidator = userValidator;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping()
    public String adminPage(Model model, Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userService.getUserByEmail(email);
        model.addAttribute("user", currentUser);
        model.addAttribute("roles", currentUser.getRoles());
        model.addAttribute("allUsers", userService.allUsers());
        return "admin";
    }


    @GetMapping("/new")
    public String newUser(Model model, Authentication authentication) {
        String email = authentication.getName();
        User currentUser = userService.getUserByEmail(email);
        model.addAttribute("currentUser", currentUser);
        model.addAttribute("roles", currentUser.getRoles());

        User user = new User();
        model.addAttribute("user", user);

        return "new";
    }

    @PostMapping("/new")
    public String create(@ModelAttribute("user") @Valid User user, @ModelAttribute(value = "select_role") String role, BindingResult bindingResult) {

        userValidator.validate(user, bindingResult);

        if (bindingResult.hasErrors()) {
            return "/new";
        }
        Set<Role> setRole = new HashSet<>();
        if (role.contains("1")) {
            setRole.add(userService.findAllRoles().get(1));
        } else {
            setRole.add(userService.findAllRoles().get(0));
        }
        user.setRoles(setRole);

        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        userService.save(user);
        return "redirect:/admin";
    }


    @PostMapping("/edit")
    public String update(@ModelAttribute(value = "select_role") String role,
                         @ModelAttribute("user") User user) {
        Set<Role> setRole = new HashSet<>();
        if (role.contains("1")) {
            setRole.add(userService.findAllRoles().get(1));
        }
        setRole.add(userService.findAllRoles().get(0));
        user.setRoles(setRole);
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        userService.save(user);
        return "redirect:/admin";
    }


    @PostMapping("/{id}")
    public String delete(@PathVariable Long id) {
        userService.delete(id);
        return "redirect:/admin";
    }
}
