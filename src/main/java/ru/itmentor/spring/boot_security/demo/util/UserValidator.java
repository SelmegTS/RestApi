package ru.itmentor.spring.boot_security.demo.util;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import ru.itmentor.spring.boot_security.demo.model.User;
import ru.itmentor.spring.boot_security.demo.service.UserService;

@Component
public class UserValidator implements Validator {

    private final UserService userService;

    public UserValidator(UserService userService) {
        this.userService = userService;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return User.class.equals(clazz);
    }

    @Override
    public void validate(Object o, Errors errors) {
        User user = (User) o;

        try {
            userService.loadUserByUsername(user.getUsername());
        } catch (UsernameNotFoundException exception) {
            return;
        }
        errors.rejectValue("username", "", "Такое имя пользователя уже зарегистрировано");

    }
}
