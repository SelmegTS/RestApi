package ru.itmentor.spring.boot_security.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.itmentor.spring.boot_security.demo.exception_handling.NoSuchUserException;
import ru.itmentor.spring.boot_security.demo.model.User;
import ru.itmentor.spring.boot_security.demo.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class RestApiController {

    private final UserService userService;

    public RestApiController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.allUsers();
    }

    @PostMapping()
    public ResponseEntity<?> create(@RequestBody User user) {
        if (user == null) {
            throw new NoSuchUserException("You wrote incorrect data");
        }
        if (userService.getUserByEmail(user.getEmail()) != null) {
            System.out.println("User already exists");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        userService.save(user);
        return new ResponseEntity<>(user, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        User user = userService.getById(id);
        if (user == null) {
            throw new NoSuchUserException("There is no user with ID " +
                    id + " in Database");
        }
        return user;
    }

    @PutMapping
    public User update(@RequestBody User user) {
        userService.save(user);
        return user;
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        User user = userService.getById(id);
        if(user == null) {
            throw new NoSuchUserException("There is no user with ID " +
                    id + " in Database");
        }
        userService.delete(id);
        return "User with ID = " + id + " was deleted";
    }
}
